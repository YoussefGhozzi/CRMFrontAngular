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

  // Data for ngx-charts
  single: any[] = [];
  multi: any[] = [];
  view: [number, number] = [700, 400];

 // options
showXAxis: boolean = true;
showYAxis: boolean = true;
gradient: boolean = false;
showLegend: boolean = true;
showXAxisLabel: boolean = true;
xAxisLabel: string = 'Jour';
showYAxisLabel: boolean = true;
yAxisLabel: string = 'Nombre de consultations';
colorScheme: any;

constructor(private userService: UserService, private tokenStorageService: TokenStorageService, private router: Router) {
  this.single = [
    {
      "name": "Lundi",
      "value": 10
    },
    {
      "name": "Mardi",
      "value": 15
    },
    {
      "name": "Mercredi",
      "value": 12
    },
    {
      "name": "Jeudi",
      "value": 8
    },
    {
      "name": "Vendredi",
      "value": 17
    }
  ];

  this.multi = [
    {
      "name": "Consultations",
      "series": [
        {
          "name": "Lundi",
          "value": 10
        },
        {
          "name": "Mardi",
          "value": 15
        },
        {
          "name": "Mercredi",
          "value": 12
        },
        {
          "name": "Jeudi",
          "value": 8
        },
        {
          "name": "Vendredi",
          "value": 17
        }
      ]
    }
  ];

  this.colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
}


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
