import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedNotifs } from '../models/medNotifs.model'

@Injectable({
  providedIn: 'root'
})
export class MedNotifsService {
  private apiUrl = 'http://localhost:5160/api/MedNotifs'; // Adjust URL


  constructor(private http: HttpClient) { }

  getMedNotifs() : Observable<MedNotifs[]>{
    return this.http.get<MedNotifs[]>(`${this.apiUrl}`, { withCredentials: true } );
  }

  deleteMedNotif(id : string) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
