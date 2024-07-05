// email-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UnipileService } from '../_services/unipile.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list-component.component.html',
  styleUrls: ['./email-list-component.component.css']
})
export class EmailListComponent implements OnInit {
  emails: any[] = [];
  cursor: string = '';

  constructor(private emailService: UnipileService) { }

  ngOnInit(): void {
    this.fetchEmails();
  }

  // email-list.component.ts
fetchEmails(): void {
  this.emailService.getAllEmails().subscribe(
    (data: any) => {
      this.emails = data.items; // Assurez-vous que 'items' est correct selon votre API
      this.cursor = data.cursor; // Assurez-vous que 'cursor' est correct selon votre API
      
      // Boucle à travers les pièces jointes avec un type spécifique
      this.emails.forEach(email => {
        if (email.attachments && email.attachments.length > 0) {
          console.log(`Attachments for email with subject '${email.subject}':`);
          email.attachments.forEach((attachment: any) => { // Spécifiez le type de 'attachment'
            console.log(`- Name: ${attachment.name}, Path: ${attachment.path}`);
          });
        }
      });
    },
    error => {
      console.error('Error fetching emails', error);
      // Gérer l'erreur selon vos besoins
    }
  );
}


  openAttachment(path: string): void {
    // Méthode pour ouvrir le fichier correspondant au chemin 'path' dans un nouvel onglet
    window.open(path, '_blank');
  }

  logout(): void {
    // Ajouter ici la logique de déconnexion si nécessaire
  }
}
