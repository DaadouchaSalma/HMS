import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/prescription.model';
import { Panier } from '../models/panier.model'


@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://localhost:5160/api/Panier'; // Adjust URL


  constructor(private http: HttpClient) { }

  addToPanier(prescription: Prescription): Observable<any> {
    console.log("Sending prescription to add to panier:", prescription);
    return this.http.post<any>(`${this.apiUrl}/add`, prescription,{ withCredentials: true });
  }

  getAllPaniers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`,{ withCredentials: true });
  }

  validatePanier(panierId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate/${panierId}`, {},{ withCredentials: true });
  }

  getPanierById(id: string): Observable<Panier> {
    return this.http.get<Panier>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }

  refreshMissingMeds(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-missing-meds`, {},{ withCredentials: true });
  }

  changePanierStatus(panierId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${panierId}/status`, {},{ withCredentials: true });
  }
  
  
}
