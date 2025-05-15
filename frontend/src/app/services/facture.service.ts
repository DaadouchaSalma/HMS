import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture.model'

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:5160/api/facture';

  constructor(private http: HttpClient) { }

  getMyFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

}
