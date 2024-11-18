import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private storage: Storage, private authService: AuthService) {}

  async ngOnInit() {
    await this.storage.create();
  }

  onLogin() {
    const loginData = { username: this.username, password: this.password };

    this.http.post<{ auth: boolean; token: string }>('http://localhost:3000/api/login', loginData)
      .subscribe(response => {
        if (this.username === 'admin' && this.password === 'admin') {
          this.authService.isAdmin(true);
        } else {
          this.authService.userAccess(this.username);
        }
        if (response.auth) {
          this.authService.setLoginStatus(true);
          this.storage.set('token', response.token);
          this.router.navigate(['/customer-data']); // Navigate to customer data page after successful login
        }
      }, error => {
        console.error('Login failed', error);
        if (error.error == 'No user found.') {
          this.authService.prompt('用户名错误');
        } else if (error.error == 'Invalid password.') {
          this.authService.prompt('密码错误');
        } else {
          this.authService.prompt('登录失败!');
        }
      });
  }
}
