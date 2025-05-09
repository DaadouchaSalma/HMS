import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessagerieService } from '../../../services/messagerie.service';
import { Message } from '../../../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Personnel } from '../../../models/personnel.model';
import { ChangeDetectorRef } from '@angular/core';

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
  unreadMessagesCount: number = 0;
  activeTab: 'all' | 'unread' = 'all';

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private messageService: MessagerieService,private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.messageService.connectSignalR();
    this.messageService.onMessageReceived((senderId, content, sentAt) => {
      if (senderId === this.selectedUserId) {
        this.messages.push({ expediteurId: senderId, content, sentAt });
        this.scrollToBottom();
      }
      const contact = this.contacts.find(c => c.id === senderId);
  if (contact) {
    contact.lastMessage = {
      content: content,
      sentAt: sentAt,
      expediteurId: senderId,
      destinataireId: this.currentUserId,
      read: false
    };
    if (senderId !== this.currentUserId) {
      this.unreadMessagesCount++;
    }
    this.sortContactsByLastMessage();
    this.filteredContacts = [...this.contacts];
    this.filterContacts();
    this.changeDetector.detectChanges();

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
        let loaded = 0;
        this.unreadMessagesCount = 0; // Réinitialiser le compteur

    
        // Pour chaque contact, charger son dernier message
        contacts.forEach(contact => {
          this.messageService.getLastMessageWith(contact.id).subscribe({
            next: (message) => {
              contact.lastMessage = message;
              /*if (message && !message.read && message.destinataireId === this.currentUserId) {
                this.unreadMessagesCount++;
              }*/
                if (message && 
                  !message.read && 
                  message.destinataireId === this.currentUserId &&
                  message.expediteurId !== this.currentUserId) {
                this.unreadMessagesCount++;
              }
              loaded++;
    
              // Une fois tous les messages chargés, trier et mettre à jour la liste filtrée
              if (loaded === contacts.length) {
                this.sortContactsByLastMessage();
                this.filteredContacts = [...this.contacts];
              }
            },
            error: (err) => {
              loaded++;
              console.error('Erreur chargement du dernier message', err);
            }
          });
        });
      });
    }
    sortContactsByLastMessage(): void {
      this.contacts.sort((a, b) => {
        const dateA = a.lastMessage?.sentAt ? new Date(a.lastMessage.sentAt).getTime() : 0;
        const dateB = b.lastMessage?.sentAt ? new Date(b.lastMessage.sentAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    selectContact(contact: any) {
      this.selectedContact = contact;
      this.selectedUserId = contact.id;
      if (contact.lastMessage && 
        !contact.lastMessage.read && 
        contact.lastMessage.destinataireId === this.currentUserId) {
      this.messageService.markAsRead(contact.lastMessage.id).subscribe(() => {
        contact.lastMessage.read = true;
        this.unreadMessagesCount--;
        this.changeDetector.detectChanges();
      });
    }

    this.filterContacts();
    this.loadMessages();
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
    }
    

  loadMessages(): void {
    this.messageService.getMessagesWith(this.selectedUserId).subscribe((msgs: any) => {
      this.messages = msgs;
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    try {
      if (this.messageContainer?.nativeElement) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
        
        // Solution alternative plus robuste
        setTimeout(() => {
          element.scroll({
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
    } catch(err) {
      console.warn('Erreur lors du scroll:', err);
    }
  }
  
  send() {
    if (this.newMessage.trim() !== '') {
      this.messageService.sendMessage(this.selectedUserId, this.newMessage).subscribe(() => {
        const messageContent = this.newMessage;
        const sentAt = new Date();
  
        this.messages.push({
          content: this.newMessage,
          expediteurId: this.currentUserId,
          sentAt: sentAt
        });
  
        this.newMessage = '';
  
        // Met à jour le dernier message pour le contact
        const contact = this.contacts.find(c => c.id === this.selectedUserId);
        if (contact) {
          contact.lastMessage = {
            content: messageContent,
            sentAt: sentAt,
            expediteurId: this.currentUserId,
            destinataireId: this.selectedUserId,
            read: true // Le message envoyé est considéré comme lu
          };
        }
  
        this.sortContactsByLastMessage(); // Trie après envoi
        this.filteredContacts = [...this.contacts]; // Met à jour la liste filtrée
        this.loadLastMessage(this.selectedUserId)
        this.changeDetector.detectChanges();
        this.filterContacts();
        setTimeout(() => this.scrollToBottom(), 100);
      });
    }
  }
  
  loadLastMessage(contactId: string) {
    this.messageService.getLastMessageWith(contactId).subscribe({
      next: (message) => {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {contact.lastMessage = message;
          this.sortContactsByLastMessage();
        this.filteredContacts = [...this.contacts];
        this.changeDetector.detectChanges();
        }
      },
      error: (err) => console.error('Erreur chargement du dernier message', err)
    });
  }
  

  /*filterContacts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(c =>
      (c.nom + ' ' + c.prenom).toLowerCase().includes(term)
    );
  }*/
    filterContacts() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.contacts.filter(c =>
        (c.nom + ' ' + c.prenom).toLowerCase().startsWith(term)
      );
    
      // Filtre supplémentaire pour l'onglet "Non lus"
      if (this.activeTab === 'unread') {
        filtered = filtered.filter(c => 
          c.lastMessage && 
          !c.lastMessage.read && 
          c.lastMessage.destinataireId === this.currentUserId &&
          c.lastMessage.expediteurId !== this.currentUserId
        );
      }
    
      this.filteredContacts = filtered;
    }
    setActiveTab(tab: 'all' | 'unread') {
      this.activeTab = tab;
      this.filterContacts();
    }
  
}