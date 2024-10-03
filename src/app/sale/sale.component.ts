import { HttpClient } from '@angular/common/http';
import { Component, input } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent {
  constructor(private http: HttpClient) { }

  foods: any = [];
  saleTemps: any = [];
  foodSizes: any = [];
  tastes: any = [];
  saleTempDetail: any = [];
  apiPath: string = '';
  tableNo: number = 1;
  userId: number = 0;
  amount: number = 0;
  saleTempId: number = 0;
  foodName: string = '';
  foodId: number = 0;
  payType: string = 'cash';
  inputMoney: number = 0;
  returnMoney: number = 0;
  billForPayUrl: string = '';

  async printBillBeforePay() {
    try {
      const payload = {
        userId: this.userId,
        tableNo: this.tableNo
      }

      const url = config.apiServer + '/api/saleTemp/printBillBeforePay';
      const res: any = await firstValueFrom(this.http.post(url, payload));

      setTimeout(() => {
        this.billForPayUrl = config.apiServer + '/' + res.fileName;
        document.getElementById('pdf-frame')?.setAttribute('src', this.billForPayUrl);
      }, 500);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  async printBillAfterPay() {
    try {
      const payload = {
        userId: this.userId,
        tableNo: this.tableNo
      }

      const url = config.apiServer + '/api/saleTemp/printBillAfterPay';
      const res: any = await firstValueFrom(this.http.post(url, payload));

      setTimeout(() => {
        const iframe = document.getElementById('pdf-frame') as HTMLIFrameElement;
        iframe.setAttribute('src', config.apiServer + '/' + res.fileName);
      }, 500);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  endSale() {
    try {
      const payload = {
        userId: this.userId,
        inputMoney: this.inputMoney,
        amount: this.amount,
        returnMoney: this.returnMoney,
        payType: this.payType,
        tableNo: this.tableNo
      }

      this.http.post(config.apiServer + '/api/saleTemp/endSale', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();

          document.getElementById('modalEndSale_btnClose')?.click();
          this.clearForm();

          // click button print bill
          const btnPrintBill = document.getElementById('btnPrintBill') as HTMLButtonElement;
          btnPrintBill.click();

          this.printBillAfterPay();
        })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  clearForm() {
    this.payType = 'cash';
    this.inputMoney = 0;
    this.returnMoney = 0;
    this.amount = 0;
  }

  getClassNameOfButton(inputMoney: number) {
    let cssClass = 'btn btn-block btn-lg';

    if (this.inputMoney == inputMoney) {
      cssClass += ' btn-secondary';
    } else {
      cssClass += ' btn-outline-secondary';
    }

    return cssClass;
  }

  changeInputMoney(inputMoney: number) {
    this.inputMoney = inputMoney;
    this.returnMoney = this.inputMoney - this.amount;
  }

  selectedPayType(payType: string) {
    this.payType = payType;
  }

  getClassName(payType: string) {
    let cssClass = 'btn btn-block btn-lg';

    if (this.payType == payType) {
      cssClass += ' btn-secondary';
    } else {
      cssClass += ' btn-outline-secondary';
    }

    return cssClass;
  }

  selectedTaste(saleTempId: number, tasteId: number) {
    try {
      const payload = {
        saleTempId: saleTempId,
        tasteId: tasteId
      }

      this.http.post(config.apiServer + '/api/saleTemp/updateTaste', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
        })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  selectedFoodSize(saleTempId: number, foodSizeId: number) {
    try {
      const payload = {
        saleTempId: saleTempId,
        foodSizeId: foodSizeId,
      };

      this.http
        .post(config.apiServer + '/api/saleTemp/updateFoodSize', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
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

  chooseFoodSize(item: any) {
    let foodTypeId: number = item.Food.foodTypeId;
    this.saleTempId = item.id;
    this.foodName = item.Food.name;
    this.foodId = item.Food.id;

    this.fetchDataTaste(foodTypeId);

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
        this.computeAmount();
      });
  }

  computeAmount() {
    this.amount = 0;

    for (let i = 0; i < this.saleTemps.length; i++) {
      const item = this.saleTemps[i];
      const totalPerRow = item.qty * item.price;

      for (let j = 0; j < item.SaleTempDetails.length; j++) {
        this.amount += item.SaleTempDetails[j].addedMoney;
      }

      this.amount += totalPerRow;
    }
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

          for (let i = 0; i < this.saleTemps.length; i++) {
            const item = this.saleTemps[i];

            if (item.SaleTempDetails.length > 0) {
              item.qty = item.SaleTempDetails.length;
              item.disabledQtyButton = true;
            }
          }

          this.computeAmount();
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

  fetchDataTaste(foodTypeId: number) {
    try {
      this.http.get(config.apiServer + '/api/taste/listByFoodTypeId/' + foodTypeId)
        .subscribe((res: any) => {
          this.tastes = res.results;
        })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  newSaleTempDetail() {
    try {
      const payload = {
        saleTempId: this.saleTempId,
        foodId: this.foodId
      }

      this.http.post(config.apiServer + '/api/saleTemp/newSaleTempDetail', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
          this.fetchDataSaleTemp();
        })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  async removeSaleTempDetail(id: number) {
    try {
      const button = await Swal.fire({
        title: 'ยกเลิกรายการ',
        text: 'คุณต้องการยกเลิกใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      })

      if (button.isConfirmed) {
        this.http.delete(config.apiServer + '/api/saleTemp/removeSaleTempDetail/' + id)
          .subscribe((res: any) => {
            this.fetchDataSaleTempDetail();
            this.fetchDataSaleTemp();
          })
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
}
