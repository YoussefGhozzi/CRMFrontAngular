import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-board-secretaire',
  templateUrl: './board-Secretaire.component.html',
  styleUrls: ['./board-Secretaire.component.css']
})
export class BoardSecretaireComponent implements OnInit {
  content?: string;
  isLoggedIn = false;
  constructor(private userService: UserService,private tokenStorageService: TokenStorageService,private router: Router) { }
  username?: string;
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.nom; 
    this.userService.getModeratorBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
}
}
