// src/app/_services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://localhost:8080/api/mesComptes'; // URL de votre backend

  constructor(private http: HttpClient) { }

  saveContact(contact: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, contact);
  }
  getAllContacts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getContactsByNetwork(network: string): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/canal/${network}`; // Assurez-vous que l'URL correspond à votre API réelle
    return this.http.get<any[]>(apiUrl);
  }
  }

