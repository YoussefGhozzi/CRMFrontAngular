import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-board-user',
  templateUrl: './board-Medecin.component.html',
  styleUrls: ['./board-Medecin.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  isLoggedIn = false;
  constructor(private userService: UserService,private tokenStorageService: TokenStorageService,private router: Router) { }
  username: string = ''; // Définition de username ici

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("userInfo",user);
    this.username = user.nom; 
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
        console.log("getUserBoard",data);
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
        console.log("error",this.content);
      }
    });
    
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
}
}
