import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import {AuthService} from './_services/auth.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  constructor(private authService: AuthService, private router: Router,private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('user');
    if (this.isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['home']);
  }
}
