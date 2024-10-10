import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import Swal from 'sweetalert2';
import { MyModalComponent } from "../my-modal/my-modal.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  constructor(private http: HttpClient) { }

  users: any[] = [];
  name: string = '';
  username: string = '';
  password: string = '';
  level: string = 'employee';
  id: number = 0;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    try {
      this.http.get(config.apiServer + '/api/user/list')
        .subscribe((res: any) => {
          this.users = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: e.message,
      });
    }
  }

  save() {
    try {
      const payload = {
        name: this.name,
        username: this.username,
        password: this.password,
        level: this.level,
        id: this.id,
      }

      if (this.id > 0) {
        this.http.put(config.apiServer + '/api/user/update', payload)
          .subscribe((res: any) => {
            this.fetchData();
            this.id = 0;
          });
      } else {
        this.http.post(config.apiServer + '/api/user/create', payload)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }

      document.getElementById('modalUser_btnClose')?.click();
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: e.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const button = await Swal.fire({
        title: 'คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        this.http.delete(config.apiServer + '/api/user/remove/' + id)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: e.message,
      });
    }
  }

  async edit(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.username = item.username;
    this.password = item.password;
    this.level = item.level;
  }

  clearForm() {
    this.id = 0;
    this.name = '';
    this.username = '';
    this.password = '';
    this.level = 'employee';
  }

}
