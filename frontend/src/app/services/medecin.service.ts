import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medecin } from '../models/medecin.model';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {

  private apiUrl = 'http://localhost:5160/api/medecin';

  constructor(private http: HttpClient) {}

  addMedecin(medecin: Medecin): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, medecin);
  }
  getMedecinById(id: string): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.apiUrl}/get/${id}`);
  }
  updateMedecin(id: string, updatedMedecin: Medecin): Observable<any> {
    return this.http.put(`${this.apiUrl}/editInfo/${id}`, updatedMedecin);
  }
  deleteMedecin(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
