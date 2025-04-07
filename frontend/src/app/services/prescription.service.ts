import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prescription } from '../models/prescription.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:5160/api/prescription';

  constructor(private http: HttpClient) { }

  addPrescription(prescription: Prescription): Observable<any> {
    return this.http.post(`${this.apiUrl}/new`, prescription);
  }

  generatePdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/generate-pdf/${id}`, { responseType: 'blob' });
  }
}
