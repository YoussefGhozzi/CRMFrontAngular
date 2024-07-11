import { Component, OnInit ,ViewChild } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { Patient } from '../model/patient.model';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  username?: string;
  dataSource = new MatTableDataSource<Patient>();
  displayedColumns: string[] = ['nom', 'prenom', 'telephone', 'adresse', 'dateTraitement', 'dateRDV', 'actions'];





  constructor(private patientService: PatientService,private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService.getAllPatients().subscribe(data => {
      this.dataSource.data = data;
    },   (error) => {
      console.error('Erreur lors de la récupération des patients:', error);
    }
  );
  }

  deletePatient(id: number): void {
    this.patientService.deletePatient(id).subscribe(() => {
      this.getPatients();
    }, (error) => {
      console.error('Erreur lors de la suppression du patient:', error);
    }
);
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
}

openFacebook(facebookLink: string): void {
  if (facebookLink) {
    // Redirection vers la page Facebook
    window.open(facebookLink, '_blank');
  }
}

openWhatsApp(whatsappNum: string): void {
  if (whatsappNum) {
    // Gérer le format du lien WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNum}`;
    window.open(whatsappUrl, '_blank');
  }
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
}
