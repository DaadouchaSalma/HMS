import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest } from '../../app/models/chatRequest.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5160/api/chatBotMed/ask';

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<string> {
    return this.http.post(this.apiUrl, request, { responseType: 'text' });
  }
}