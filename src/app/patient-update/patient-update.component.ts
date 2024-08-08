import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../_services/patient.service';
import { Patient } from '../model/patient.model';
import { TokenStorageService } from '../_services/token-storage.service';


@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styleUrls: ['./patient-update.component.css']
})
export class PatientUpdateComponent implements OnInit {
  patient: Patient = new Patient();
  id: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  username?: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.patientService.getPatientById(this.id).subscribe(data => {
      this.patient = data;
    }, error => console.error(error));
  }

  updatePatient(): void {
    this.patientService.updatePatient(this.id, this.patient).subscribe(data => {
      this.successMessage = 'Patient updated successfully';
      setTimeout(() => {
        this.successMessage = null; // Efface le message après quelques secondes
        this.router.navigate(['/patients']); // Redirection vers la liste des patients
      }, 3000); // Message de succès affiché pendant 3 secondes

    }, error => {
      if (error.status === 500) {
        this.errorMessage = 'Erreur: Les coordonnées modifiées existent déjà. Veuillez vérifier vos informations.';
      } else {
        this.errorMessage = 'Erreur lors de la mise à jour du patient: ' + error.message;
      }
    });
  }

  onSubmit(): void {
    this.updatePatient();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
}
}
