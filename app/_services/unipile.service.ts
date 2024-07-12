import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UnipileService {

  private apiUrl = 'https://api2.unipile.com:13237';
  private apiKey = 'bQW7auVm.ny4F+3UGY3WkipGqOx3AEWjSOxS8JGuCDAI2r2oD+08='
  private ACCOUNT_ID = 's1n0MG0sRSuWj5eBcHJKEQ';

  constructor(private http: HttpClient) { }

  sendEmail(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

   
    return this.http.post<any>(`${this.apiUrl}/api/v1/emails`, formData, { headers });
}

getAllEmails(): Observable<any> {
  const headers = new HttpHeaders({
    'X-API-KEY': this.apiKey
  });

  const params = {
    account_id: this.ACCOUNT_ID,
    filter: JSON.stringify({ role: ['inbox', 'sent'] })
  };
  console.log('Headers:', headers);
    console.log('Params:', params);
  return this.http.get<any>(`${this.apiUrl}/api/v1/emails`, { headers, params });
}

getAllChats(): Observable<any> {
  const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey });
  return this.http.get(`${this.apiUrl}/api/v1/chats`, { headers });
}

getAllMessagesFromChat(chat_id: string): Observable<any> {
  const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey});
  return this.http.get(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, { headers });
}


sendMessage(chat_id: string, text: string): Observable<any> {
  const headers = new HttpHeaders({
    'X-API-KEY': this.apiKey,
    'Content-Type': 'application/json'
  });
  const url = `${this.apiUrl}/messaging/sendMessage`;
  const body = { chat_id, text };
  return this.http.post(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, body, { headers });
}
getChats(): Observable<any[]> {
  const headers = new HttpHeaders({
    'X-API-KEY': this.apiKey,
    'Content-Type': 'application/json'
  });
  return this.http.get<any[]>(`${this.apiUrl}/messaging/getChats`, { headers });
}
getMessageAttachment(attachment_id: string, message_id: string): Observable<any> {
  const headers = new HttpHeaders({
    'X-API-KEY': this.apiKey,
  });

  return this.http.get(`${this.apiUrl}/messaging/attachments/${attachment_id}/messages/${message_id}`, { headers })
    .pipe(
      catchError(this.handleError)
    );
}
private handleError(error: any) {
  console.error('An error occurred', error);
  return throwError(error.message || error);
}
}
