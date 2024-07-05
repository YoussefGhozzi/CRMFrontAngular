import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:8081/api/client/';
export interface LoginResponse {
  id: number;
  role: string;
  nom:string;
  prenom:string;
  email:String;
  adresse:String;
  age:Number
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router: Router) { }

  register(email: string, password: string, confirmPassword: string, nom: string, prenom: string, adresse: string, age: number, role: string): Observable<any> {
    return this.http.post(API_URL + 'register', {
      email,
      password,
      confirmPassword,
      nom,
      prenom,
      adresse,
      age,
      role
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}login`, { email, password })
    .pipe(
      tap(any=>this.saveUserInLocalStorage((any)))
    );
  }

  // Fonction pour enregistrer l'utilisateur dans le localStorage
  private saveUserInLocalStorage(user:LoginResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  getCurrentUser(): LoginResponse | null {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }


  logout(): void {
    // Code de déconnexion ici, par exemple, vider le localStorage ou appeler l'API de déconnexion
    localStorage.removeItem('user');
  }
  }

 

