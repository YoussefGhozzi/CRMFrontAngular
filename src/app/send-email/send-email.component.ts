import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnipileService } from '../_services/unipile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup;
  emailSentSuccessfully: boolean = false;
  username: string = '';
  account_id: string='';

  constructor(
    private fb: FormBuilder,
    private emailService: UnipileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      recipients: this.fb.array([]),
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      this.account_id = params['account_id'];
      this.username = params['username'];
      console.log('Account ID in EmailComponent:', this.account_id);

  });
  }
  ngOnInit(): void {}

  get recipientForms() {
    return this.emailForm.get('recipients') as FormArray;
  }

  createRecipient(): FormGroup {
    return this.fb.group({
      display_name: ['', Validators.required],
      identifier: ['', [Validators.required, Validators.email]]
    });
  }

  addRecipient() {
    this.recipientForms.push(this.createRecipient());
  }

  removeRecipient(index: number) {
    this.recipientForms.removeAt(index);
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      return;
    }

    const formData = new FormData();
    const recipients = this.emailForm.value.recipients.map((recipient: any) => ({
      display_name: recipient.display_name,
      identifier: recipient.identifier
    }));
// Récupérer l'ID du compte de manière dynamique

    formData.append('to', JSON.stringify(recipients));
    formData.append('account_id',this.account_id); // Utiliser l'ID de compte dynamique
    formData.append('subject', this.emailForm.value.subject);
    formData.append('body', this.emailForm.value.body);

    this.emailService.sendEmail(formData).subscribe(
      response => {
        console.log('Email sent successfully:', response);
        this.emailSentSuccessfully = true;
        setTimeout(() => {
          this.router.navigate(['reseaux-sociaux']);
        }, 2000);
        this.emailForm.reset();
      },
      error => {
        console.error('Error sending email:', error);
        alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.');
      }
    );
  }

  logout() {
    // Add logout logic here if needed
  }
}
