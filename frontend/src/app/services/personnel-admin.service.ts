import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonnelAdmin } from '../models/personnelAdmin.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelAdminService {

  private apiUrl = 'http://localhost:5160/api/admin';

  constructor(private http: HttpClient) {}

  addPersonnelAdministrative(personnelAdmin: PersonnelAdmin): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, personnelAdmin);
  }
  getPersonnelAById(id: string): Observable<PersonnelAdmin> {
    return this.http.get<PersonnelAdmin>(`${this.apiUrl}/get/${id}`);
  }
  updatePersonnelA(id: string, updatedPersonnelA: PersonnelAdmin): Observable<any> {
    return this.http.put(`${this.apiUrl}/editInfo/${id}`, updatedPersonnelA);
  }
  deletePersonnelA(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

  