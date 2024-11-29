import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MentorService } from '../metor.service';
import { MessageDetailsComponent } from '../message-details/message-details.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
 
  displayedColumns: string[] = ['from', 'subject', 'date', 'actions'];
  dataSource!: MatTableDataSource<any>;
  messageForm!: FormGroup;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private mentorService: MentorService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}
 
  ngOnInit() {
    this.loadMessages();
    this.initMessageForm();
  }
 
  initMessageForm() {
    this.messageForm = this.fb.group({
      to: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
 
  loadMessages() {
    this.mentorService.getMessages().subscribe(
      messages => {
        this.dataSource = new MatTableDataSource(messages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.error('Error loading messages:', error)
    );
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  openMessageDetail(message: any) {
    const dialogRef = this.dialog.open(MessageDetailsComponent, {
      width: '500px',
      data: message
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reply') {
        this.messageForm.patchValue({
          to: message.from,
          subject: `Re: ${message.subject}`
        });
      }
    });
  }
 
  sendMessage() {
    if (this.messageForm.valid) {
      const message = this.messageForm.value;
      this.mentorService.sendMessage(message).subscribe(
        () => {
          this.loadMessages();
          this.messageForm.reset();
        },
        error => console.error('Error sending message:', error)
      );
    }
  }
 
  deleteMessage(messageId: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.mentorService.deleteMessage(messageId).subscribe(
        () => this.loadMessages(),
        error => console.error('Error deleting message:', error)
      );
    }
  }
}
