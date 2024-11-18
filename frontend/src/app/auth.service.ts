// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api'; // Base URL for your API
  // BehaviorSubject to store login status and emit changes
  private loginStatus = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loginStatus.asObservable();

  // BehaviorSubject to store and emit any shared data after login
  private sharedData = new BehaviorSubject<boolean>(false);
  sharedData$ = this.sharedData.asObservable();

  // BehaviorSubject to store and emit user access data after login
  private access= new BehaviorSubject<string>("");
  access$ = this.access.asObservable();

  constructor(private http: HttpClient, private alertController: AlertController) {}

  async prompt(err:string) {
    const alert = await this.alertController.create({
      message: err,
      buttons: [
        {
          text: '确定',
          role: '取消'
        }
      ]
    });

    await alert.present();
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${'http://localhost:3000/api'}/users/${userId}`);
  }

  deleteCustomer(customerId: string): Observable<any> {
    return this.http.delete(`${'http://localhost:3000/api'}/customers/${customerId}`);
  }

  // Method to update login status
  setLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }

  // Method to share data
  isAdmin(data: boolean) {
    this.sharedData.next(data);
  }

  // User Access
  userAccess(data: string) {
    this.access.next(data);
  }

  // Method to log out
  // logout(): void {
  //   this.loginService.authenticated = false; // Reset authentication state
  //   localStorage.removeItem('token'); // Clear token from local storage if applicable
  // }

  // Optional: Method to store token or user data
  // saveToken(token: string): void {
  //   this.loginService.authenticated = true;
  //   localStorage.setItem('token', token); // Save token to local storage
  // }
}
