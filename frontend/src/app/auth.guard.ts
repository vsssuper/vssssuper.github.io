import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: Storage) {}

  async canActivate(): Promise<boolean> {
    await this.storage.create();
    const token = await this.storage.get('token');
    if (token) {
      return true; // Allow access
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      return false; // Deny access
    }
  }
}
