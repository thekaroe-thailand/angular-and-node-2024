import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import config from '../../config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill-sale',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bill-sale.component.html',
  styleUrl: './bill-sale.component.css'
})
export class BillSaleComponent {
  constructor(private http: HttpClient) { }

  billSales: any[] = [];
  startDate: string = dayjs().startOf('month').format('YYYY-MM-DD');
  endDate: string = dayjs().endOf('month').format('YYYY-MM-DD');
  dayjs = dayjs;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const payload = {
      startDate: new Date(this.startDate),
      endDate: new Date(this.endDate)
    }

    this.http.post(config.apiServer + '/api/billSale/list', payload).subscribe((res: any) => {
      this.billSales = res.results;
    });
  }

  async removeBillSale(id: number) {
    // confirm by SWal
    const button = await Swal.fire({
      title: 'คุณต้องการยกเลิกใบเสร็จนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (button.isConfirmed) {
      this.http.delete(config.apiServer + '/api/billSale/remove/' + id).subscribe((res: any) => {
        this.fetchData();
      });
    }
  }

  getPayType(payType: string) {
    if (payType == 'cash') {
      return 'เงินสด';
    } else if (payType == 'transfer') {
      return 'จ่ายด้วยบัญชีธนาคาร';
    } else {
      return '';
    }
  }
}

