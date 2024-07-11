import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../model/patient.model'; // Assurez-vous que ce chemin correspond à votre modèle de patient
import { PatientService } from '../_services/patient.service'; // Assurez-vous que ce chemin correspond à votre service de patient
import { HttpErrorResponse } from '@angular/common/http'; // Importez HttpErrorResponse pour gérer les erreurs HTTP
import { TokenStorageService } from '../_services/token-storage.service';


@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  patient: Patient = new Patient();
  successMessage: string = '';
  errorMessage: string = '';
  validationErrors: any = {};
  username?: string;

  constructor(private patientService: PatientService,private tokenStorageService: TokenStorageService ,private router: Router) {}

  ngOnInit(): void {}

  savePatient(form: NgForm) {
    this.validationErrors = {};

    // Vérifier si le formulaire est valide
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        if (control.invalid) {
          this.validationErrors[field] = 'Ce champ est obligatoire.';
        }
      });
      return;
    }

    // Appel au service pour enregistrer le patient
    this.patientService.createPatient(this.patient).subscribe(
      (response) => {
        console.log('Patient enregistré avec succès!', response);
        this.successMessage = 'Patient enregistré avec succès.';
        this.errorMessage = ''; // Réinitialiser le message d'erreur si nécessaire
        // Réinitialisation du formulaire après enregistrement réussi
        form.resetForm();
        this.patient = new Patient(); // Réinitialiser l'objet patient
        // Redirection vers la liste des patients après un court délai
        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 2000);
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'enregistrement du patient:', error);
        if (error.status === 409) {
          this.errorMessage = 'Erreur : Un patient avec les mêmes informations existe déjà.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
        this.successMessage = ''; // Réinitialiser le message de succès si nécessaire
      }
    );
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
}
}
