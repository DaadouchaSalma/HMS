import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medecin } from '../models/medecin.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MedecinService {

  private apiUrl = 'http://localhost:5160/api/medecin';

  constructor(private http: HttpClient) {}

  addMedecin(medecin: Medecin): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, medecin,{ withCredentials: true });
  }
  getMedecinById(): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.apiUrl}/get`,{ withCredentials: true });
  }
  getMedecinByIdAdmin(id: string): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.apiUrl}/getA/${id}`,{ withCredentials: true });
  }
  updateMedecin( updatedMedecin: Medecin): Observable<any> {
    return this.http.put(`${this.apiUrl}/editInfo`, updatedMedecin,{ withCredentials: true });
  }
  updateMedecinAdmin(id: string, updatedMedecin: Medecin): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, updatedMedecin,{ withCredentials: true });
  }
  deleteMedecin(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
  getMedecinCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true });
  }
  getMedecinCountByService(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/medecin-count-by-service`);
  }
}
