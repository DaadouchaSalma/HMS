import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclamation.model'

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:5160/api/Reclamation';
  constructor(private http: HttpClient) { }
//liste des reclamations  
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}`);
  }

 // Ajouter réclamation
  addReclamation(patientId: string, reclamation: Reclamation): Observable<any> {
    return this.http.post(`${this.apiUrl}/${patientId}`, reclamation);
  }
  // Supprimer réclamation
  deleteReclamation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getChambres(): Observable<{ id: string, numeroChambre: string }[]> {
    return this.http.get<{ id: string, numeroChambre: string }[]>(`${this.apiUrl}`);
  }
  

  

}
