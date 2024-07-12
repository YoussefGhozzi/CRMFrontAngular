import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-board-moderator',
  templateUrl: './super_admin.component.html',
  styleUrls: ['./super_admin.component.css']
})
export class BoardModeratorComponent implements OnInit {
  content?: string;
  private roles: string[] = [];
  username?: string;
  currentUser: any;

  constructor(private userService: UserService,private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.nom; 
    this.currentUser = this.tokenStorageService.getUser();
    }
    
  
    logout(): void {
      this.tokenStorageService.signOut();
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });

    }
  }
