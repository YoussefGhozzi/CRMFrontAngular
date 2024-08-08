import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: any= {
    email: null,
    password: null,
    confirmPassword: null,
    nom: null,
    prenom: null,
    adresse: null,
    age: null,
    role: null
  };
  isSignUpSuccess = false;
  isSignUpFailed = false;
  errorMessage = '';

  roles = ['Super_Admin', 'Admin', 'Secretaire', 'Medecin']; // Ajout des rôles possibles

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    const { email, password, confirmPassword, nom, prenom, adresse, age, role } = this.form;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isSignUpFailed = true;
      return;
    }

    this.authService.register(email, password, confirmPassword, nom, prenom, adresse, age, role).subscribe(
      data => {
        console.log(data);
        this.isSignUpSuccess = true;
        this.isSignUpFailed = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirection vers la page de connexion après 2 secondes (2000 ms)
      },
      err => {
        if (err.status === 400 && Array.isArray(err.error) && err.error.includes('Email déjà utilisé')) {
          this.errorMessage = 'Email déjà utilisé';
        } else {
          this.errorMessage = 'Inscription échouée! Veuillez réessayer avec un autre email.';
        }
        this.isSignUpFailed = true;
      }
    );
  }
}
