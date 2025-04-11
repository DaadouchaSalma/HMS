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
    return this.http.post(`${this.apiUrl}/add`, pharmacien,{ withCredentials: true });
  }
  getPharmacienById(): Observable<Pharmacien> {
      return this.http.get<Pharmacien>(`${this.apiUrl}/get`,{ withCredentials: true });
  }
  getPharmacienByIdAdmin(id: string): Observable<Pharmacien> {
    return this.http.get<Pharmacien>(`${this.apiUrl}/getA/${id}`,{ withCredentials: true });
}
  updatePharmacien( updatedPharmacien: Pharmacien): Observable<any> {
      return this.http.put(`${this.apiUrl}/editInfo`, updatedPharmacien,{ withCredentials: true });
  }
  deletePharmacien(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
  updatePharmacienAdmin(id: string, updatedPharmacien: Pharmacien): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, updatedPharmacien,{ withCredentials: true });
}
}
