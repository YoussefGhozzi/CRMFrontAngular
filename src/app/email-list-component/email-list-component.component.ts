import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { UnipileService } from '../_services/unipile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list-component.component.html',
  styleUrls: ['./email-list-component.component.css']
})
export class EmailListComponent implements OnInit {
  emails: any[] = [];
  filteredEmails: any[] = [];
  paginatedEmails: any[] = [];
  pageSize = 5;
  cursor: string = '';
  username: string = '';
  length = 0;
  searchTerm: string = '';
  account_id: string = '';
  emailForm!: FormGroup;
  showEmailForm: boolean = false;
  emailSentSuccessfully: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private emailService: UnipileService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      recipients: this.fb.array([
        this.createRecipientFormGroup()
      ]),
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.account_id = params['account_id'];
      this.username = params['username'];
      if (this.account_id) {
        this.fetchEmails();
      }
    });
  }

  get recipientsArray(): FormArray {
    return this.emailForm.get('recipients') as FormArray;
  }

  fetchEmails(): void {
    this.emailService.getAllEmails(this.account_id).subscribe(
      (data: any) => {
        console.log('Fetched emails:', data); // Log de débogage
        this.emails = data.items;
        this.cursor = data.cursor;
        this.filterEmails();
      },
      error => {
        console.error('Error fetching emails', error);
      }
    );
  }

  filterEmails(): void {
    if (this.searchTerm) {
      this.filteredEmails = this.emails.filter(email =>
        email.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        email.from_attendee.display_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        email.to_attendees.some((attendee: any) => attendee.display_name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredEmails = this.emails;
    }
    this.length = this.filteredEmails.length;
    this.updatePaginatedEmails();
  }

  updatePaginatedEmails(pageIndex: number = 0): void {
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmails = this.filteredEmails.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.updatePaginatedEmails(event.pageIndex);
    this.scrollToTop();
  }

  handleSearchTermChange(): void {
    this.filterEmails();
    this.updatePaginatedEmails(0);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAttachment(path: string): void {
    window.open(path, '_blank');
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }

    const formData = new FormData();
    const recipients = this.emailForm.value.recipients.map((recipient: any) => ({
      display_name: recipient.display_name,
      identifier: recipient.identifier
    }));

    formData.append('to', JSON.stringify(recipients));
    formData.append('account_id', this.account_id);
    formData.append('subject', this.emailForm.value.subject);
    formData.append('body', this.emailForm.value.body);

    this.emailService.sendEmail(formData).subscribe(
      response => {
        console.log('Email sent successfully:', response); // Log de débogage
        this.emailSentSuccessfully = true;
        this.errorMessage = null;  // Réinitialisez le message d'erreur
        setTimeout(() => {
          this.emailSentSuccessfully = false;
        }, 2000);
        this.emailForm.reset();
        this.showEmailForm = false;
        this.fetchEmails();  // Actualiser les emails après envoi réussi
      },
      error => {
        console.error('Error sending email:', error);
        this.emailSentSuccessfully = false; // Assurez-vous que le succès est réinitialisé
        this.errorMessage = 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.';
      }
    );
  }

  removeRecipient(index: number): void {
    this.recipientsArray.removeAt(index);
  }

  addRecipient(): void {
    this.recipientsArray.push(this.createRecipientFormGroup());
  }

  createRecipientFormGroup(): FormGroup {
    return this.fb.group({
      display_name: ['', Validators.required],
      identifier: ['', [Validators.required, Validators.email]]
    });
  }

  toggleEmailForm(): void {
    this.showEmailForm = !this.showEmailForm;
    if (!this.showEmailForm) {
      this.emailForm.reset();
    }
  }
  logout(){

  }
  closeSuccessAlert(): void {
    this.emailSentSuccessfully = false;
  }
  
  closeErrorAlert(): void {
    this.errorMessage = null;
  }
  
}
