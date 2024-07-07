import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Ajoutez cette ligne
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardSecretaireComponent } from './board-Secretaire/board-Secretaire.component';
import { BoardUserComponent } from './board-Medecin/board-Medecin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { BoardModeratorComponent } from './board-super_admin/super_admin.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { ReseauxSociauxComponent } from './reseaux-sociaux/reseaux-sociaux.component';
import { EmailListComponent } from './email-list-component/email-list-component.component';
import { UnipileService} from './_services/unipile.service';
import { SafeUrlPipe } from './safe-url.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardSecretaireComponent,
    BoardUserComponent,
    BoardModeratorComponent,
    SendEmailComponent,
    ReseauxSociauxComponent,
    EmailListComponent,
    SafeUrlPipe,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, RouterModule.forRoot([ // Assurez-vous que vous avez des routes définies
      {path:'home', component:HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'Medecin', component:BoardUserComponent },
  { path: 'Super_Admin', component: BoardModeratorComponent },
  { path: 'Admin', component: BoardAdminComponent },
  { path: 'Secretaire', component:  BoardSecretaireComponent },
  {path:'reseaux-sociaux', component:ReseauxSociauxComponent },
  {path:'send-mail',component:SendEmailComponent},
  {path:'email-list',component:EmailListComponent},
  {path:'chat',component:ChatComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'**',redirectTo:'home'}
    ])
  ],
  providers: [authInterceptorProviders,UnipileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
