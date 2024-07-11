import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reseaux-sociaux',
  templateUrl: './reseaux-sociaux.component.html',
  styleUrls: ['./reseaux-sociaux.component.css']
})

export class ReseauxSociauxComponent {
  username:string="";
  selectedSocialNetwork: string = ''; // Variable pour suivre le réseau social sélectionné
  hoverColor: string = '';
  constructor(private tokenStorageService:TokenStorageService,private router:Router) {}

  loadSocialNetwork(network: string) {
    // Logique pour charger les données du réseau social sélectionné
    this.selectedSocialNetwork = network;
  }
  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
}
}
