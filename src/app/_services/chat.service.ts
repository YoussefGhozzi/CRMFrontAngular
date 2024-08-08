import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api4.unipile.com:13427';
  private apiKey = 'OPypYyq0.xSJj8vaXGQVNf12Nz5DKSGsaAjRqiYHyy4TPZlT/HSM=';
  private account_id: string = '';

  constructor(private http: HttpClient) {}

  setAccountId(accountId: string) {
    this.account_id = accountId;
  }

  getAccountId() {
    return this.account_id;
  }
  
  getChats(account_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/api/v1/chats?account_id=${account_id}`, { headers });
  }

  getAllMessages(chatId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'account_id': this.account_id // Passer l'account_id via les headers
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/api/v1/chats/${chatId}/messages`, { headers }).pipe(
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

  sendWhatsAppAttachment(chat_id: string, attendeesIds: string[], text: string, attachment: File,account_id :string): Observable<any> {
    console.log("l'account id est:",account_id);
    if (!account_id) {
      throw new Error('Account ID is not set. Please set account ID before sending WhatsApp attachments.');

    }

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('account_id', account_id);
    formData.append('text', text);
    formData.append('subject', 'Message avec pièce jointe');
    formData.append('attachments', attachment, attachment.name);
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

  getAttachments(chatId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/chats/${chatId}/attachments`);
  }
  
}
