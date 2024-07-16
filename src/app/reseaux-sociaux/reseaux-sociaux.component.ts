import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../_services/contact.service';

@Component({
  selector: 'app-reseaux-sociaux',
  templateUrl: './reseaux-sociaux.component.html',
  styleUrls: ['./reseaux-sociaux.component.css']
})
export class ReseauxSociauxComponent {
  username: string = '';
  selectedSocialNetwork: string = '';
  showForm: boolean = false;
  newContact: any = {}; // Object for the new contact to add
  contacts: any[] = []; // Array to store contacts retrieved from API

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private http: HttpClient,
    private contactService: ContactService
  ) {
    const user = this.tokenStorageService.getUser();
    this.username = user.username;
  }

  loadSocialNetwork(network: string) {
    this.selectedSocialNetwork = network;
    console.log(`Loading contacts for network: ${network}`);
    this.contactService.getContactsByNetwork(network).subscribe(
      (data: any[]) => {
        this.contacts = data;
        console.log('Contacts loaded:', this.contacts);
      },
      error => {
        console.error('Erreur lors du chargement des contacts par réseau social :', error);
      }
    );
  }

  getContactsBySocialNetwork(socialNetwork: string) {
    this.contactService.getContactsByNetwork(socialNetwork).subscribe(
      (data: any[]) => { // Utilisation de (data: any[]) pour correspondre au type attendu
        this.contacts = data; // Assignation des contacts récupérés à this.contacts
        console.log(`Contacts for ${socialNetwork}:`, this.contacts);
      },
      error => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  showAddAccountForm() {
    this.showForm = true;
    this.newContact = {}; // Reset form fields for new contact
  }

  handleAccountAdded(event: any) {
    this.showForm = false;
    this.getContactsBySocialNetwork(this.selectedSocialNetwork); // Refresh contact list after adding
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  selectAccount(account_id: string, username: string): void {
    console.log(`Selected account ID: ${account_id}, Username: ${username}`);
    if (this.selectedSocialNetwork === 'gmail') {
      this.router.navigate(['/email-list'], { queryParams: { account_id, username } });
    } else if (this.selectedSocialNetwork === 'whatsapp') {
      this.router.navigate(['/chat'], { queryParams: { account_id, username } });
    }
  }
 
}
