export class Patient {
  id?: number;
  nom?: string;
  prenom?: string;
  age?: number;
  telephone?: number;
  adresse?: string;
  nationalite?: string;
  canalTraitement?: string;
  source?: string;
  dateTraitement?: string | Date | undefined; // Peut être une chaîne, une Date ou undefined
  dateRDV?: string | Date | undefined; // Peut être une chaîne, une Date ou undefined
  facebookLink?: string;
  whatsappNum?: number;
  numDossier?: string;
  adresseMail?: string;
}
