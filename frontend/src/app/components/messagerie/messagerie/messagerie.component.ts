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

  getCurrentUserId() {
    this.messageService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id!;
        console.log('current user: lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll', this.currentUserId)
      },
      error: (err) => console.error("Erreur récupération de l'utilisateur courant", err)
    });
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

  send(): void {
    if (!this.newMessage.trim()) return;

    this.messageService.sendMessage(this.selectedUserId, this.newMessage).subscribe(() => {
      this.messages.push({
        content: this.newMessage,
        sentAt: new Date()
      });
      this.newMessage = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  filterContacts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(c =>
      (c.nom + ' ' + c.prenom).toLowerCase().includes(term)
    );
  }
}