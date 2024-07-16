import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../_services/contact.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddAccountComponent {
  contact: any = {}; // Initialisation du contact vide
  @Output() onAdd = new EventEmitter<any>(); // Événement à émettre lorsque le compte est ajouté

  constructor(private http: HttpClient, private contactService: ContactService) {}

  onSubmit() {
    console.log('Contact data before sending:', this.contact); // Log les données du contact avant l'envoi
    this.contactService.saveContact(this.contact).subscribe(
      response => {
        console.log('Contact saved successfully:', response); // Log la réponse réussie
        this.onAdd.emit(response); // Émet l'événement avec les données du contact
      },
      error => {
        console.error('Error saving contact:', error); // Log toute erreur
      }
    );
  }
}
