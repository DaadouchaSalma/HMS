import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admission } from "../../models/admission.model";
import{Patient} from "../../models/patient.model"
import{Chambre} from "../../models/chambre.model"
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private apiUrl = 'http://localhost:5160/api/Admission';

  constructor(private http: HttpClient) { }
  addAdmission(admission: Admission): Observable<Admission> {
    return this.http.post<Admission>(this.apiUrl, admission);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }
  getChambresDisponibles(service: string, niveauEquipement: string): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/chambres/disponibles?service=${service}&niveauEquipement=${niveauEquipement}`);
  }
  getAdmissions(): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.apiUrl}/listeAdmission`);
  }

  sortirPatient(admissionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sortie/${admissionId}`, {});
  }
}
