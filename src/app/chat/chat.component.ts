import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: any[] = [];
  messages: any[] = [];
  chat_id: string = '';
  text: string = '';
  selectedChat: any;
  errorMessage: string = '';
  existingContacts: any[] = []; // Tableau pour stocker les contacts existants
  private refreshTimeout: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.getChats();
  }

  ngOnDestroy() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  getChats() {
    this.chatService.getChats().subscribe(
      data => {
        if (data && data.items && Array.isArray(data.items)) {
          this.chats = data.items;
          // Récupérer les numéros de téléphone à partir des chats
          this.updateContactsFromChats();
        } else {
          this.errorMessage = 'La réponse du service getChats n\'est pas valide.';
          console.error('La réponse du service getChats n\'est pas valide', data);
        }
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des discussions.';
        console.error('Erreur lors de la récupération des discussions', error);
      }
    );
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    if (chat && chat.id) {
      this.chat_id = chat.id;
      this.getAllMessagesFromChat(this.chat_id);
      console.log('Selected chat object:', chat); // Affiche l'objet de la discussion sélectionnée dans la console
    }
  }

  getAllMessagesFromChat(chatId: string) {
    this.chatService.getAllMessagesFromChat(chatId).subscribe(
      data => {
        if (Array.isArray(data)) {
          this.messages = data;
          this.scheduleNextRefresh();
        } else {
          this.errorMessage = 'La réponse du service getAllMessagesFromChat n\'est pas un tableau.';
          console.error('La réponse du service getAllMessagesFromChat n\'est pas un tableau', data);
        }
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des messages du chat.';
        console.error('Erreur lors de la récupération des messages du chat', error);
      }
    );
  }

  scheduleNextRefresh() {
    this.refreshTimeout = setTimeout(() => {
      this.getAllMessagesFromChat(this.chat_id);
    }, 5000); // Rafraîchir toutes les 5 secondes
  }

  sendMessage() {
    if (this.chat_id && this.text.trim()) {
      this.chatService.sendMessage(this.chat_id, this.text).subscribe(
        response => {
          this.text = '';
          // Mise à jour des messages après l'envoi du message
          this.getAllMessagesFromChat(this.chat_id);
          console.log('Message envoyé avec succès :', response);
        },
        error => {
          this.errorMessage = 'Erreur lors de l\'envoi du message.';
          console.error('Erreur lors de l\'envoi du message', error);
        }
      );
    }
  }

  extractPhoneNumber(chatProviderId: string): string {
    if (!chatProviderId) return '';

    // Extraction du numéro de téléphone à partir de chat_provider_id
    const phoneNumber = chatProviderId.split('@')[0]; // Supposant que le format est '21650712311@s.whatsapp.net'
    console.log('Extracted phone number:', phoneNumber);

    return phoneNumber;
  }

  getPhoneNumberFromChat(chat: any): string {
    if (chat && chat.provider_id) {
      return this.extractPhoneNumber(chat.provider_id);
    }
    return '';
  }

  hasAttachment(message: any): boolean {
    return message && message.attachments && message.attachments.length > 0;
  }

  showAttachment(message: any) {
    console.log('Attachment:', message.attachments);
    // Code pour afficher les détails de la pièce jointe ou gérer la logique d'affichage
  }

  logout(): void {
    // Ajouter ici la logique de déconnexion si nécessaire
  }

  registerName(contact: any) {
    const newName = prompt('Entrez le nom du contact:');
    if (newName) {
      contact.name = newName;
      // Sauvegarder le nom du contact (à adapter pour votre logique de sauvegarde)
      this.saveContactName(contact);
    }
  }

  updateContactsFromChats() {
    this.chats.forEach(chat => {
      const phoneNumber = this.extractPhoneNumber(chat.provider_id);
      if (phoneNumber && !this.contactExists(phoneNumber)) {
        this.existingContacts.push({ phoneNumber });
      }
    });
  }

  contactExists(phoneNumber: string): boolean {
    return this.existingContacts.some(contact => contact.phoneNumber === phoneNumber);
  }

  saveContactName(contact: any) {
    // Logique pour sauvegarder le nom du contact
    // Exemple : sauvegarder dans une base de données ou localStorage
    console.log('Contact saved:', contact);
  }
}
