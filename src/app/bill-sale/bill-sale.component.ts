import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import config from '../../config';

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
}

