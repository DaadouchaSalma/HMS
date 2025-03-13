import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pharmacien } from '../models/pharmacien.model';

@Injectable({
  providedIn: 'root'
})
export class PharmacienService {

  private apiUrl = 'http://localhost:5160/api/pharmacien';

  constructor(private http: HttpClient) {}

  addPharmacien(pharmacien: Pharmacien): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, pharmacien);
  }
  getPharmacienById(id: string): Observable<Pharmacien> {
      return this.http.get<Pharmacien>(`${this.apiUrl}/get/${id}`);
  }
  updatePharmacien(id: string, updatedPharmacien: Pharmacien): Observable<any> {
      return this.http.put(`${this.apiUrl}/editInfo/${id}`, updatedPharmacien);
  }
  deletePharmacien(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
