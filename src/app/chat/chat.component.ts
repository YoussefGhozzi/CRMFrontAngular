import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../_services/chat.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  attachments: any[] = [];
  uploadedFileUrl: string = '';
  selectedFile: File | null = null;
  selectedFileUrl: SafeResourceUrl | null = null;
  username:string="";

  constructor(private chatService: ChatService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log('Component initialized. Fetching chats...');
    this.getChats();
  this.scheduleNextRefresh();
  }

  ngOnDestroy() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  getChats() {
    console.log('Fetching chats from backend...');
    this.chatService.getChats().subscribe(
      (data: any) => {
        if (data && data.items && Array.isArray(data.items)) {
          this.chats = data.items;
          this.updateContactsFromChats();
          console.log('Chats fetched successfully.', this.chats.length, 'chats found.');
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
      this.attendeesIds = [chat.provider_id];
      this.getAllMessagesFromChat(this.chat_id);
      console.log('Selected chat object:', chat);
    }
  }
  scheduleNextRefresh() {
    this.refreshTimeout = setTimeout(() => {
      this.getAllMessagesFromChat(this.chat_id);
      console.log(this.getAllMessagesFromChat)
    }, 5000); // Rafraîchir toutes les 5 secondes
  }
  getAllMessagesFromChat(chatId: string) {
    console.log('Fetching messages for chat id:', chatId);
    console.log('tous les message ',    this.chatService.getAllMessages(chatId));
    this.chatService.getAllMessages(chatId).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.messages = data;
          console.log('Messages fetched successfully.', data, 'messages found.');
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

  sendMessage() {
    if (this.chat_id && this.text.trim()) {
      this.chatService.sendMessage(this.chat_id, this.text).subscribe(
        response => {
          this.text = '';
          this.getAllMessagesFromChat(this.chat_id);
          console.log('Message envoyé avec succès :', response);
          this.messages.push({
            text: this.text,
            is_sender: 1, // Définissez le bon expéditeur pour ce message
            attachments: [] // S'il n'y a pas de pièce jointe à afficher avec ce message
          });
          this.text = ''; // Effacez le champ de saisie après l'envoi du message
          // });
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
    const phoneNumber = chatProviderId.split('@')[0];
    return phoneNumber;
  }

  getPhoneNumberFromChat(chat: any): string {
    if (chat && chat.provider_id) {
      return this.extractPhoneNumber(chat.provider_id);
    }
    return '';
  }

  logout(): void {
    // Logique de déconnexion
  }

  registerName(contact: any) {
    const newName = prompt('Entrez le nom du contact:');
    if (newName) {
      contact.name = newName;
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
    console.log('Contact saved:', contact);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

   
  }

  sendAttachment() {
    if (this.selectedFile) {
      this.chatService.sendWhatsAppAttachment(this.chat_id, this.attendeesIds, this.text, this.selectedFile).subscribe(
        (response: any) => {
          console.log('Attachment sent successfully:', response);
          this.uploadedFileUrl = response.fileUrl; // Assurez-vous que `response.fileUrl` contient l'URL correcte du fichier après l'envoi
          const fileName = this.selectedFile?.name; // Récupérez le nom du fichier sélectionné
          this.addSuccessMessage(`Fichier "${fileName}" envoyé avec succès.`);

          if (this.selectedChat) {
            if (!this.selectedChat.attachments) {
              this.selectedChat.attachments = [];
            }
            this.selectedChat.attachments.push({ url: this.uploadedFileUrl, name: fileName });
          }
          this.messages.push({
            text: 'Fichier attaché envoyé avec succès',
            is_sender: 1, // Définissez le bon expéditeur pour ce message
            attachments: [] // S'il n'y a pas de pièce jointe à afficher avec ce message
          });
          // });
          // Rafraîchir la liste des messages ou la page ici si nécessaire

          // Réinitialiser les variables
          this.selectedFile = null;
          this.selectedFileUrl = null;
        },
        (error: any) => {
          console.error('Error sending attachment', error);
        }
      );
    } else {
      console.error('No file selected');
    }
  }
  addSuccessMessage(message: string) {
    const successMessage = {
      text: message,
      is_sender: 1, // Indique que c'est un message envoyé par l'utilisateur
      attachments: [] // Vous pouvez ajouter des informations sur l'envoi ici si nécessaire
    };
    this.messages.push(successMessage);
  }
  
  // loadAttachments() {
  //   this.chatService.getAttachments(this.chat_id).subscribe(
  //     (response: any) => {
  //       console.log('Attachments received successfully:', response);
  //       this.attachments = response;
  //     },
  //     (error: any) => {
  //       console.error('Error receiving attachments', error);
  //     }
  //   );
  // }

  isImage(url: string): boolean {
    if (!url) {
      return false;
    }
    const splitUrl = url.split('.');
    const extension = splitUrl[splitUrl.length - 1].toLowerCase();
    if(extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
      return true;
    } return false;}

  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.attachment = file;
      this.attachmentPath = file.name;
    } else {
      this.attachment = null;
      this.attachmentPath = '';
    }
  }

  openFile() {
    if (this.selectedFileUrl) {
      window.open(this.selectedFileUrl.toString(), '_blank');
    }
  }

  isPdfType(fileType: string| undefined): boolean {
    return fileType === 'application/pdf';
  }
  isWordType(fileType: string| undefined): boolean {
    return !!fileType &&fileType.includes('application/word') 
  }
  
  isExcelType(fileType: string| undefined): boolean {
    return !!fileType &&fileType.includes('application/excel') 
  }
  
  isCsvType(fileType: string| undefined): boolean {
    return !!fileType &&fileType.includes('text/csv');
  }
  

  isDocumentType(fileType: string| undefined): boolean {
    return (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }

  isImageType(fileType: string | undefined): boolean {
    return !!fileType && fileType.startsWith('image/');
  }
  hasAttachment(message: any): boolean {
    return message && message.attachments && message.attachments.length > 0;
  }
  
 
}
