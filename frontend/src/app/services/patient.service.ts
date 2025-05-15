import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:5160/api/patient';
  
  constructor(private http: HttpClient) { }
  createPatient(patient: Patient): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/new`, patient, { withCredentials: true });
  }

  updatePatient(patient: Partial<Patient>): Observable<void> {
    return this.http.put<any>(`${this.apiUrl}/update`, patient, { withCredentials: true });
  }

  getPatientById(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/me`, { withCredentials: true });
  }
  
  getAllPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  getBubblePatients() : Observable <any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/info`, { withCredentials: true })
  }

}