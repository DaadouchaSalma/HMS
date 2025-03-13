import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../models/personnel.model';
import { Medecin } from '../models/medecin.model';
import { PersonnelAdmin } from '../models/personnelAdmin.model';
import { Pharmacien } from '../models/pharmacien.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  private apiUrl = 'http://localhost:5160/api/personnel/add';

  constructor(private http: HttpClient) {}

  addPersonnel(personnel: Personnel): Observable<any> {
    return this.http.post(this.apiUrl, personnel);
  }
  getPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>('http://localhost:5160/api/personnel');
  }
  getMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>('http://localhost:5160/api/medecin');
  }
  // Get Personnel by ID
  getPersonnelById(id: string): Observable<Personnel> {
    return this.http.get<Personnel>(`http://localhost:5160/api/personnel/get/${id}`);
  }
  getPersonnelAById(id: string): Observable<PersonnelAdmin> {
    return this.http.get<PersonnelAdmin>(`http://localhost:5160/api/admin/get/${id}`);
  }
  getPharmacienById(id: string): Observable<Pharmacien> {
    return this.http.get<Pharmacien>(`http://localhost:5160/api/pharmacien/get/${id}`);
  }
  
  // Edit Personnel info
  editPersonnel(id: string, updatedPersonnel: Personnel): Observable<any> {
    return this.http.put(`http://localhost:5160/api/personnel/editInfo/${id}`, updatedPersonnel);
  }
}
