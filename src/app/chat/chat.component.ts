import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { ChatService } from '../_services/chat.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chats: any[] = [];
  messages: any[] = [];
  chat_id: string = '';
  selectedChat: any;
  errorMessage: string = '';
  existingContacts: any[] = [];
  attachment: any;
  private refreshTimeout: any;
  attendeesIds: string[] = [];
  text: string = '';
  attachmentPath: string = '';
  uploadedFileUrl: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: SafeResourceUrl | null = null;
  account_id: string = '';
  username: any;

  constructor(private chatService: ChatService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.account_id = params['account_id'];
      this.username = params['username']; // Récupérer le username depuis les queryParams
      console.log('Account ID in ChatComponent:', this.account_id);
      console.log('Username in ChatComponent:', this.username);
  
      if (this.account_id) {
        this.getChats(); // Appeler la méthode pour obtenir les chats en fonction de account_id
        this.scheduleNextRefresh();
      }
    });
  }

  ngOnDestroy() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  getChats() {
    this.chatService.getChats(this.account_id).subscribe(
      (data: any) => {
        if (data && data.items && Array.isArray(data.items)) {
          this.chats = data.items;
          this.updateContactsFromChats();
        } else {
          this.errorMessage = 'La réponse du service getChats n\'est pas valide.';
        }
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des discussions.';
      }
    );
  }

  selectChat(chat: any) {
    console.log('Chat sélectionné :', chat);
  
    this.selectedChat = chat;
    if (chat && chat.id) {
      this.chat_id = chat.id;
      this.account_id = chat.account_id;
      this.attendeesIds = [chat.provider_id];
      console.log('Chat ID sélectionné :', this.chat_id);
      console.log('Account ID sélectionné :', this.account_id);
      console.log('Attendees IDs :', this.attendeesIds);
  
      this.getAllMessagesFromChat(this.chat_id);
    }
  }
  

  scheduleNextRefresh() {
    this.refreshTimeout = setTimeout(() => {
      this.getAllMessagesFromChat(this.chat_id);
    }, 5000);
  }

  getAllMessagesFromChat(chatId: string) {
    if (!chatId) return;
    this.chatService.getAllMessages(chatId).subscribe(
      (data: any[]) => {
        this.messages = data;
        this.scheduleNextRefresh();
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des messages du chat.';
      }
    );
  }

  send() {
    if (this.selectedFile) {
      this.sendAttachment();
    } else {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.chat_id && this.text.trim()) {
      this.chatService.sendMessage(this.chat_id, this.text).subscribe(
        response => {
          this.messages.push({
            text: this.text,
            is_sender: 1,
            attachments: []
          });
          this.text = '';
          this.getAllMessagesFromChat(this.chat_id);
        },
        error => {
          this.errorMessage = 'Erreur lors de l\'envoi du message.';
        }
      );
    }
  }

  sendAttachment() {
    if (this.selectedFile && this.chat_id && this.attendeesIds.length > 0) {
      this.chatService.sendWhatsAppAttachment(this.chat_id, this.attendeesIds, this.text, this.selectedFile).subscribe(
        (response: any) => {
          this.uploadedFileUrl = response.fileUrl;
          const fileName = this.selectedFile?.name;
          this.addSuccessMessage(`Fichier "${fileName}" envoyé avec succès.`);
          if (this.selectedChat) {
            if (!this.selectedChat.attachments) {
              this.selectedChat.attachments = [];
            }
            this.selectedChat.attachments.push({ url: this.uploadedFileUrl, name: fileName });
          }
          this.messages.push({
            text: 'Fichier attaché envoyé avec succès',
            is_sender: 1,
            attachments: []
          });
          this.selectedFile = null;
          this.selectedFileUrl = null;
        },
        (error: any) => {
          this.errorMessage = 'Erreur lors de l\'envoi du fichier.';
        }
      );
    } else {
      this.errorMessage = 'No file selected or attendees not specified.';
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.selectedFile));
    }
  }

  extractPhoneNumber(chatProviderId: string): string {
    if (!chatProviderId) return '';
    const phoneRegex = /\d{10,15}/;
    const match = chatProviderId.match(phoneRegex);
    return match ? match[0] : '';
  }

  updateContactsFromChats() {
    this.existingContacts = this.chats.map(chat => ({
      provider_id: chat.provider_id,
      name: chat.name,
      phoneNumber: this.extractPhoneNumber(chat.provider_id)
    }));
  }

  getPhoneNumberFromChat(chat: any): string {
    return this.extractPhoneNumber(chat.provider_id);
  }

  registerName(chat: any) {
    const newName = prompt('Enter the new name for this contact:');
    if (newName) {
      chat.name = newName;
    }
  }

  hasAttachment(message: any): boolean {
    return message && message.attachments && message.attachments.length > 0;
  }

  addSuccessMessage(message: string) {
    this.messages.push({
      text: message,
      is_sender: 1,
      attachments: []
    });
  }

  logout() {
    // Implement your logout logic here
  }
}
