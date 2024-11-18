import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  users: any[] = [];
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController, private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Load users from the backend
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe((data) => {
      this.users = data;
    });
  }

  onSignup() {
    const signupData = { username: this.username, password: this.password };

    this.http.post('http://localhost:3000/api/signup', signupData)
      .subscribe(response => {
        console.log('Signup successful', response);
        this.loadUsers();
        this.authService.prompt("成功注册新用户 (用户名:" + this.username 
          + " 密码:" + this.password + ")");
      }, error => {
        console.error('Signup failed', error);
        this.authService.prompt('注册用户失败!');
      });
  }

  deleteUser(userId: string) {
    this.authService.deleteUser(userId).subscribe(
      response => {
        console.log('User deleted:', response);
        this.users = this.users.filter(user => user.id !== userId);
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  async confirmDelete(userId: string) {
    const alert = await this.alertController.create({
      message: '确认要删除吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.deleteUser(userId);
          },
        }
      ]
    });
    await alert.present();
  }
}
