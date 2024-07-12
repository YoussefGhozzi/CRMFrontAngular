import { Component, OnInit } from '@angular/core';
import { UnipileService } from '../_services/unipile.service';
import { PageEvent } from '@angular/material/paginator';

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
  username: string = "";
  length = 0;
  searchTerm: string = '';

  constructor(private emailService: UnipileService) { }

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.emailService.getAllEmails().subscribe(
      (data: any) => {
        console.log("data email", data);
        this.emails = data.items; // Ensure 'items' is correct according to your API
        this.cursor = data.cursor; // Ensure 'cursor' is correct according to your API
        this.filterEmails();
      },
      error => {
        console.error('Error fetching emails', error);
        // Handle the error as needed
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
    this.updatePaginatedEmails(0); // Reset to first page after filtering
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAttachment(path: string): void {
    // Method to open the file at 'path' in a new tab
    window.open(path, '_blank');
  }

  logout(): void {
    // Add logout logic here if needed
  }
}
