import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import { MyModalComponent } from '../my-modal/my-modal.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent {
  constructor(private http: HttpClient) {}

  foods: any = [];
  saleTemps: any = [];
  foodSizes: any = [];
  apiPath: string = '';
  tableNo: number = 1;
  userId: number = 0;
  amount: number = 0;
  saleTempId: number = 0;
  foodName: string = '';
  saleTempDetail: any = [];

  selectedFoodSize(saleTempId: number, foodSizeId: number) {}

  chooseFoodSize(item: any) {
    let foodTypeId: number = item.Food.foodTypeId;
    this.saleTempId = item.id;
    this.foodName = item.Food.name;

    try {
      this.http
        .get(config.apiServer + '/api/foodSize/filter/' + foodTypeId)
        .subscribe((res: any) => {
          this.foodSizes = res.results;
        });

      const payload = {
        foodId: item.foodId,
        qty: item.qty,
        saleTempId: item.id,
      };

      this.http
        .post(config.apiServer + '/api/saleTemp/createDetail', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSaleTempDetail() {
    this.http
      .get(
        config.apiServer + '/api/saleTemp/listSaleTempDetail/' + this.saleTempId
      )
      .subscribe((res: any) => {
        this.saleTempDetail = res.results;
      });
  }

  async removeItem(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบ ' + item.Food.name,
        text: 'คุณต้องการลบรายการใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(
            config.apiServer +
              '/api/saleTemp/remove/' +
              item.foodId +
              '/' +
              this.userId
          )
          .subscribe((res: any) => {
            this.fetchDataSaleTemp();
          });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async clearAllRow() {
    const button = await Swal.fire({
      title: 'ล้างรายการ',
      text: 'คุณต้องการล้างรายการทั้งหมดใช่หรือไม่',
      showCancelButton: true,
      showConfirmButton: true,
      icon: 'question',
    });

    if (button.isConfirmed) {
      this.http
        .delete(config.apiServer + '/api/saleTemp/clear/' + this.userId)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
        });
    }
  }

  changeQty(id: number, style: string) {
    try {
      const payload = {
        id: id,
        style: style,
      };
      this.http
        .put(config.apiServer + '/api/saleTemp/changeQty', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  ngOnInit() {
    this.fetchData();

    this.apiPath = config.apiServer;

    const userId = localStorage.getItem('angular_id');

    if (userId !== null) {
      this.userId = parseInt(userId);
      this.fetchDataSaleTemp();
    }
  }

  saveToSaleTemp(item: any) {
    try {
      const payload = {
        qty: 1,
        tableNo: this.tableNo,
        foodId: item.id,
        userId: this.userId,
      };

      this.http
        .post(config.apiServer + '/api/saleTemp/create', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSaleTemp() {
    try {
      this.http
        .get(config.apiServer + '/api/saleTemp/list/' + this.userId)
        .subscribe((res: any) => {
          this.saleTemps = res.results;

          this.amount = 0;

          for (let i = 0; i < this.saleTemps.length; i++) {
            const item = this.saleTemps[i];
            const qty = item.qty;
            const price = item.price;

            this.amount += qty * price;
          }
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  filter(foodType: string) {
    try {
      this.http
        .get(config.apiServer + '/api/food/filter/' + foodType)
        .subscribe((res: any) => {
          this.foods = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchData() {
    try {
      this.http
        .get(config.apiServer + '/api/food/list')
        .subscribe((res: any) => {
          this.foods = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }
}
