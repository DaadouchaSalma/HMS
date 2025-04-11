import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/founisseur.model';
@Injectable({
  providedIn: 'root'
})
export class FournisseursService {
  private apiUrl = 'http://localhost:5160/api/Fournisseur'; // Adjust URL


  constructor(private http: HttpClient) { }

  getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl,{ withCredentials: true });
  }

  getFournisseurById(id: string): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }

  addFournisseur(Fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, Fournisseur,{ withCredentials: true });
  }
  updateFournisseur(id: string, Fournisseur: Fournisseur): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, Fournisseur,{ withCredentials: true });
  }

  deleteFournisseur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
}

