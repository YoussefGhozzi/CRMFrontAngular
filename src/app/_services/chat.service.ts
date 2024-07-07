import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importer map depuis RxJS

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api2.unipile.com:13237';
  private apiKey = 'bQW7auVm.ny4F+3UGY3WkipGqOx3AEWjSOxS8JGuCDAI2r2oD+08=';
  private ACCOUNT_ID = 'fJGeblh9RNOwtHukHUeVUg';

  constructor(private http: HttpClient) {}

  getChats(): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/api/v1/chats`, { headers });
  }

  getAllMessagesFromChat(chat_id: string): Observable<any[]> { // Spécifier le type de retour comme un tableau de messages
    const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey });
    return this.http.get<any>(`${this.apiUrl}/api/v1/chats/${chat_id}/messages`, { headers }).pipe(
      map((response: any) => response.items as any[]) // Utiliser map de RxJS pour transformer la réponse
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
}
