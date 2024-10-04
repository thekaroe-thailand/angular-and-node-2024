import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import dayjs from 'dayjs';
import config from '../../config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-sum-per-day',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-sum-per-day.component.html',
  styleUrl: './report-sum-per-day.component.css'
})
export class ReportSumPerDayComponent {
  constructor(private http: HttpClient){}

  ddlYear: number[] = [];
  ddlMonth: string[] = [];
  data: any[] = [];
  year: number = dayjs().year();
  month: number = dayjs().month() + 1;
  dayjs: typeof dayjs = dayjs;

  ngOnInit() {
    this.ddlYear = this.getYear();
    this.ddlMonth = this.getMonth();

    this.fetchData();
  }

  getYear() {
    const currentYear = dayjs().year();
    return Array.from( { length: 5 }, (_, i) => currentYear - i);
  }

  getMonth() {
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return thaiMonths;
  }

  fetchData() {
    const payload = {
      year: this.year,
      month: this.month
    }

    this.http.post(config.apiServer + '/api/report/sumPerDayInYearAndMonth', payload)
    .subscribe((res: any) => {
      this.data = res.results;
    })
  }
}
