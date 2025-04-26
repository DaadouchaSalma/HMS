import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessagerieService } from '../../../services/messagerie.service';
import { Message } from '../../../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Personnel } from '../../../models/personnel.model';

@Component({
  selector: 'app-messagerie',
  imports: [CommonModule, FormsModule],
  templateUrl: './messagerie.component.html',
  styleUrl: './messagerie.component.scss'
})
export class MessagerieComponent implements OnInit {
  messages: any[] = [];
  contacts: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  selectedUserId!: string;
  selectedContact: any = null;
  searchTerm: string = '';
  filteredContacts: Personnel[] = [];

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private messageService: MessagerieService) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.messageService.connectSignalR();
    this.messageService.onMessageReceived((senderId, content, sentAt) => {
      if (senderId === this.selectedUserId) {
        this.messages.push({ expediteurId: senderId, content, sentAt });
        this.scrollToBottom();
      }
    });

    this.loadContacts();
  }

  getTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'Administratif';
      case 1: return 'Médecin';
      case 2: return 'Pharmacien';
      case 3:return  'Administrateur';
      default: return 'Inconnu';
    }
  }

  getCurrentUserId() {
    this.messageService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id!;
        console.log('current user: lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll', this.currentUserId)
      },
      error: (err) => {
        console.error("Full error object:", err);
        console.error("Error status:", err.status);
        console.error("Error message:", err.message);
        console.error("Error response:", err.error);
      }
    });
  }

  getTypeIcon(type: number): string {
    switch (type) {
      case 0: return 'fas fa-briefcase'; // Icône utilisateur
      case 1: return 'fas fa-user-md'; // Icône médecin
      case 2: return 'fas fa-pills'; // Icône pharmacien
      case 3: return 'fas fa-user-cog';
      default: return 'fas fa-question-circle';
    }
  }

  loadContacts(): void {
    this.messageService.getAllExceptCurrent().subscribe((contacts) => {
      this.contacts = contacts;
      this.filteredContacts = contacts;
    });
  }

  selectContact(contact: any): void {
    this.selectedUserId = contact.id;
    this.selectedContact = contact;
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessagesWith(this.selectedUserId).subscribe((msgs: any) => {
      this.messages = msgs;
      this.scrollToBottom();
    });
  }


  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  
  send() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        content: this.newMessage,
        expediteurId: this.currentUserId,
        sentAt: new Date()
      });
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 100); // Scroll after sending
    }
  }

  filterContacts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(c =>
      (c.nom + ' ' + c.prenom).toLowerCase().includes(term)
    );
  }

  
}