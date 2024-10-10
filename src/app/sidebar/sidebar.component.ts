import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private http: HttpClient, private router: Router) { }

  name: string = '';
  level: string = '';

  ngOnInit() {
    this.name = localStorage.getItem('angular_name')!;
    this.getLevelFromToken();
  }

  getLevelFromToken() {
    const token = localStorage.getItem('angular_token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(config.apiServer + '/api/user/getLevelFromToken', { headers: headers })
      .subscribe((res: any) => {
        this.level = res.level;
      });
  }

  async signout() {
    const button = await Swal.fire({
      title: 'ออกจากระบบ',
      text: 'คุณต้องการออกจากระบบ ใช่หรือไม่',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (button.isConfirmed) {
      localStorage.removeItem('angular_token');
      localStorage.removeItem('angular_name');

      location.reload();

      // navigate to login page
      this.router.navigate(['/']);
    }
  }
}
