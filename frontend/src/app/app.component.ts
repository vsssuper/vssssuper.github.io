import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    // Listen for login status
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    // Listen for any shared data after login
    this.authService.sharedData$.subscribe((data) => {
      this.isAdmin = data;
    });
  }

  // logout() {
  //   this.authService.logout(); // Assuming you have a logout method in your AuthService
  //   this.router.navigate(['/login']); // Redirect to login page
  // }
}
