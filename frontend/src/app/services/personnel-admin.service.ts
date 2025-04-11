import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonnelAdmin } from '../models/personnelAdmin.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelAdminService {

  private apiUrl = 'http://localhost:5160/api/PersonnelAdmin';

  constructor(private http: HttpClient) {}

  addPersonnelAdministrative(personnelAdmin: PersonnelAdmin): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, personnelAdmin,{ withCredentials: true });
  }
  getPersonnelAByIdAdmin(id: string): Observable<PersonnelAdmin> {
    return this.http.get<PersonnelAdmin>(`${this.apiUrl}/getA/${id}`,{ withCredentials: true });
  }
  getPersonnelAById(): Observable<PersonnelAdmin> {
    return this.http.get<PersonnelAdmin>(`${this.apiUrl}/get`,{ withCredentials: true });
  }
  updatePersonnelA( updatedPersonnelA: PersonnelAdmin): Observable<any> {
    return this.http.put(`${this.apiUrl}/editInfo`, updatedPersonnelA,{ withCredentials: true });
  }
  deletePersonnelA(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
  updatePersonnelAdmin(id: string, updatedPersonnelA: PersonnelAdmin): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, updatedPersonnelA,{ withCredentials: true });
  }
}

  