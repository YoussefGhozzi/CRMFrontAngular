import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      data => {
        localStorage.setItem('user', JSON.stringify({ id: data.id, role: data.role }));
        this.isLoggedIn = true;
        this.isLoginFailed = false;

        // Redirection based on role
        switch (data.role) {
          case 'Medecin':
            this.router.navigate(['/Medecin']);
            break;
          case 'Admin':
            this.router.navigate(['/Admin']);
            break;
          case 'Secretaire':
            this.router.navigate(['/Secretaire']);
            break;
          case 'Super_Admin':
            this.router.navigate(['/Super_Admin']);
            break;
          default:
            this.router.navigate(['/default-dashboard']);
            break;
        }
      },
      err => {
        this.errorMessage = err.error.message || 'Email ou mot de passe incorrect! Veuillez le vérifier.';
        this.isLoginFailed = true;
      }
    );
  }
}
