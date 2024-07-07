import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import {AuthService} from './_services/auth.service'
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  
  






  constructor(private authService: AuthService, private router: Router,private tokenStorageService: TokenStorageService,private http: HttpClient) {}



  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['home']);
  }

}
