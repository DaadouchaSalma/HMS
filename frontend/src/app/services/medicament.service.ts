import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicament } from '../models/medicaments.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {


  private apiUrl = 'http://localhost:5160/api/MedMat'; // Adjust URL

  constructor(private http: HttpClient) {}

  getMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl,{ withCredentials: true });
  }

  getMedicamentById(id: string): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }

  addMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.post<Medicament>(this.apiUrl, medicament,{ withCredentials: true });
  }

  updateMedicament(id: string, medicament: Medicament): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, medicament,{ withCredentials: true });
  }

  deleteMedicament(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
}
