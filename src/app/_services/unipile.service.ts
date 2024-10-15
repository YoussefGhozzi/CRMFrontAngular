// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
// import { Observable , throwError} from 'rxjs';
// import { catchError } from 'rxjs/operators';
// @Injectable({
//   providedIn: 'root'
// })
// export class UnipileService {

//   private apiUrl = 'https://api6.unipile.com:13649';
//   private apiKey = '3wXDYYmi.rEze+AuwLQ1CKg2YdSjGoeyHw4kussfpdljYFu8FrSc='
//   private ACCOUNT_ID :string='';

//   constructor(private http: HttpClient) { }

//   sendEmail(formData: FormData): Observable<any> {
//     const headers = new HttpHeaders({
//       'X-API-KEY': this.apiKey
//     });

   
//     return this.http.post<any>(`${this.apiUrl}/api/v1/emails`, formData, { headers });
// }

// getAllEmails(): Observable<any> {
//   const headers = new HttpHeaders({
//     'X-API-KEY': this.apiKey
//   });

//   const params = {
//     account_id: this.ACCOUNT_ID,
//     filter: JSON.stringify({ role: ['inbox', 'sent'] })
//   };
//   console.log('Headers:', headers);
//     console.log('Params:', params);
//   return this.http.get<any>(`${this.apiUrl}/api/v1/emails`, { headers, params });
// }

// getAllChats(): Observable<any> {
//   const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey });
//   return this.http.get(`${this.apiUrl}/api/v1/chats`, { headers });
// }

// getAllMessagesFromChat(chat_id: string): Observable<any> {
//   const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey});
//   return this.http.get(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, { headers });
// }


// sendMessage(chat_id: string, text: string): Observable<any> {
//   const headers = new HttpHeaders({
//     'X-API-KEY': this.apiKey,
//     'Content-Type': 'application/json'
//   });
//   const url = `${this.apiUrl}/messaging/sendMessage`;
//   const body = { chat_id, text };
//   return this.http.post(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, body, { headers });
// }
// getChats(): Observable<any[]> {
//   const headers = new HttpHeaders({
//     'X-API-KEY': this.apiKey,
//     'Content-Type': 'application/json'
//   });
//   return this.http.get<any[]>(`${this.apiUrl}/messaging/getChats`, { headers });
// }
// getMessageAttachment(attachment_id: string, message_id: string): Observable<any> {
//   const headers = new HttpHeaders({
//     'X-API-KEY': this.apiKey,
//   });

//   return this.http.get(`${this.apiUrl}/messaging/attachments/${attachment_id}/messages/${message_id}`, { headers })
//     .pipe(
//       catchError(this.handleError)
//     );
// }
// private handleError(error: any) {
//   console.error('An error occurred', error);
//   return throwError(error.message || error);
// }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnipileService {

  private apiUrl = 'https://api8.unipile.com:13837';
  private apiKey = 'tEY2xctV.oeu29dsXdYGBGjgUlf3WRpwNNvQjDYe3RWtGm24wJsQ=';
 
  constructor(private http: HttpClient) {}
  
  sendEmail( formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

    

    return this.http.post<any>(`${this.apiUrl}/api/v1/emails`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllEmails(accountId: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

    const params = new HttpParams()
      .set('account_id', accountId)
      .set('filter', JSON.stringify({ role: ['inbox', 'sent'] }));

    return this.http.get<any>(`${this.apiUrl}/api/v1/emails`, { headers, params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
