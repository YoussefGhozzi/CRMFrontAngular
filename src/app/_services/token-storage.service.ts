import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || '{}');
  }

  // Ajout de méthodes pour les comptes par canal
  public saveContactsByNetwork(network: string, contacts: any[]): void {
    const key = `${USER_KEY}-${network}-contacts`;
    window.sessionStorage.setItem(key, JSON.stringify(contacts));
  }

  public getContactsByNetwork(network: string): any[] {
    const key = `${USER_KEY}-${network}-contacts`;
    const contacts = JSON.parse(sessionStorage.getItem(key) || '[]');
    return contacts;
  }
}
