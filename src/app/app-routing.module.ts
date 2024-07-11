import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-Medecin/board-Medecin.component';
import {  BoardSecretaireComponent} from './board-Secretaire/board-Secretaire.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import{BoardModeratorComponent} from './board-super_admin/super_admin.component';
import { AuthGuard } from './guards/Auth.Guard';
import { RoleGuard } from './guards/Role.Guard';
import { ReseauxSociauxComponent } from './reseaux-sociaux/reseaux-sociaux.component';
import { SendEmailComponent } from './send-email/send-email.component';
import {EmailListComponent}from './email-list-component/email-list-component.component'
import { ChatComponent } from './chat/chat.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientUpdateComponent } from './patient-update/patient-update.component';


const routes: Routes = [
  {path:'home', component:HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'Medecin', component:BoardUserComponent },
  { path: 'Super_Admin', component: BoardModeratorComponent},
  { path: 'Admin', component: BoardAdminComponent },
  { path: 'Secretaire', component:  BoardSecretaireComponent },
  {path:'reseaux-sociaux', component:ReseauxSociauxComponent },
  {path:'send-mail',component:SendEmailComponent},
  {path:'email-list',component:EmailListComponent},
  {path:'chat',component:ChatComponent},
  { path: 'patientss', component: PatientListComponent },
  { path: 'patients/new', component: PatientFormComponent },
  { path: 'patients/:id', component: PatientUpdateComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'**',redirectTo:'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
