import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import config from '../../config';

@Component({
  selector: 'app-food-paginate',
  standalone: true,
  imports: [],
  templateUrl: './food-paginate.component.html',
  styleUrl: './food-paginate.component.css'
})
export class FoodPaginateComponent {
  constructor(private http: HttpClient) { }

  foods: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalPageArray: number[] = [];

  ngOnInit() {
    this.fetchData();
  }

  changePage(page: number) {
    this.page = page;
    this.fetchData();
  }

  async fetchData() {
    try {
      const payload = {
        page: this.page,
        pageSize: this.pageSize,
      };

      this.http.post(config.apiServer + '/api/food/listPaginate', payload).subscribe((res: any) => {
        this.foods = res.results;
        this.total = res.total;

        // คำนวณจำนวนหน้า
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.totalPageArray = Array.from({ length: this.totalPage }, (_, i) => i + 1);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
