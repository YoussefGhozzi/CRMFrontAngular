import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api2.unipile.com:13237';
  private apiKey = 'bQW7auVm.ny4F+3UGY3WkipGqOx3AEWjSOxS8JGuCDAI2r2oD+08=';
  private ACCOUNT_ID = 'fJGeblh9RNOwtHukHUeVUg';

  attachmentPreviewUrl: SafeUrl | undefined;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getChats(): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/api/v1/chats`, { headers });
  }

  getAllMessages(chat_id: string): Observable<any[]> {
    const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey });
    return this.http.get<any>(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, { headers }).pipe(
      map((response: any) => response.items as any[])
    );
  }

  sendMessage(chat_id: string, text: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const body = { chat_id, text };
    return this.http.post<any>(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, body, { headers });
  }

  sendWhatsAppAttachment(chat_id: string, attendeesIds: string[], text: string, attachment: File): Observable<any> {
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('account_id', this.ACCOUNT_ID);
    formData.append('text', text);
    formData.append('subject', 'Message avec pièce jointe');
    formData.append('attachments', attachment);
    formData.append('attendeesIds', JSON.stringify(attendeesIds));
    attendeesIds.forEach(id => formData.append('attendees_ids', id));

    const httpOptions = {
        headers: new HttpHeaders({
            'X-API-KEY': this.apiKey
        })
    };

    return this.http.post(`${this.apiUrl}/api/v1/chats`, formData, httpOptions).pipe(
      catchError(this.handleError)
    );
}
private handleError(error: any) {
  console.error('An error occurred', error);
  return throwError(error.message || error);
}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.attachmentPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.attachmentPreviewUrl = undefined;
    }
  }
  // getAttachments(chatId: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/api/v1/chats/${chatId}/attachments`);
  // }
}
