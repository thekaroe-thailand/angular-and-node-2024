import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent {
  constructor(private http: HttpClient) {}

  foods: any[] = [];
  saleTemps: any[] = [];
  apiPath: string = '';
  tableNo: number = 1;
  userId: number = 0;
  amount: number = 0;

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
          .delete(config.apiServer + '/api/saleTemp/remove/' + item.foodId)
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
