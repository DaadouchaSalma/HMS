import { Component } from '@angular/core';
import { ChatService } from '../../../services/chatService.service';
import { ChatRequest } from '../../../models/chatRequest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, IconDirective],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  userInput = '';
  messages: { sender: string; text: string }[] = [];
  isOpen = false;
  isTyping = false;

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'user', text: this.userInput });
    this.isTyping = true;

    const request: ChatRequest = {
      userMessage: this.userInput
    };

    this.chatService.sendMessage(request).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.messages.push({ sender: 'bot', text: marked(response) });
          this.isTyping = false;
        }, 1000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.messages.push({ sender: 'bot', text: 'Erreur lors de la communication avec le chatbot.' });
      }
    });

    this.userInput = '';
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        sender: 'bot',
        text: marked("👋 Bienvenue chez SmartCare ! Je suis votre compagnon santé digital. Je vous informe, je vous oriente, mais je ne prescris pas." )
      });
    }
  }
}