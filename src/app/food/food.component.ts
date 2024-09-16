import { Component } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import config from '../../config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css',
})
export class FoodComponent {
  constructor(private http: HttpClient) {}

  foodTypes: any[] = [];
  foods: any[] = [];
  name: string = '';
  fileName: string = '';
  price: number = 0;
  remark: string = '';
  foodType: string = 'food';
  id: number = 0;
  foodTypeId: number = 0;

  ngOnInit() {
    this.fetchData();
    this.fetchDataFoodTypes();
  }

  async fetchData() {}

  async fetchDataFoodTypes() {
    try {
      this.http
        .get(config.apiServer + '/api/foodType/list')
        .subscribe((res: any) => {
          this.foodTypes = res.results;
          this.foodTypeId = this.foodTypes[0].id;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  clearForm() {}

  save() {
    try {
      const payload = {
        foodTypeId: parseInt(this.foodTypeId.toString()),
        name: this.name,
        img: this.fileName,
        price: this.price,
        remark: this.remark,
        foodType: this.foodType,
        id: this.id,
      };

      if (this.id > 0) {
        this.http
          .put(config.apiServer + '/api/food/update', payload)
          .subscribe((res: any) => {
            this.fetchData();
            this.id = 0;
          });
      } else {
        this.http
          .post(config.apiServer + '/api/food/create', payload)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }

      document.getElementById('modalFood_btnClose')?.click();
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }
}
