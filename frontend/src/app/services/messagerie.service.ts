import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../models/personnel.model'

@Injectable({ providedIn: 'root' })
export class MessagerieService {

    private hubConnection!: signalR.HubConnection;
    private baseUrl = `http://localhost:5160/api/message`; 
  
    constructor(private http: HttpClient) {}
  
    connectSignalR(): void {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('/message', {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();
  
      this.hubConnection
        .start()
        .catch(err => console.error('Erreur de connexion SignalR:', err));
    }
  
    onMessageReceived(callback: (senderId: string, content: string, sentAt: string) => void): void {
      this.hubConnection.on('ReceiveMessage', (senderId, content, sentAt) => {
        callback(senderId, content, sentAt);
      });
    }
  
    sendMessage(receiverId: string, content: string) {
      return this.http.post(this.baseUrl, {
        destinataireId: receiverId,
        content: content
      }, { withCredentials: true }); 
    }
  
    getMessagesWith(userId: string) {
      return this.http.get(`${this.baseUrl}/between/${userId}`, {
        withCredentials: true
      });
    }

    getAllExceptCurrent() {
      return this.http.get<any[]>(`${this.baseUrl}/listePerso`, {
        withCredentials: true
      });
    }

    getCurrentUser(): Observable<Personnel> {
      return this.http.get<Personnel>(`${this.baseUrl}/me`, {
        withCredentials: true
      });
    }
}