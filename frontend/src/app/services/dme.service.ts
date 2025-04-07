import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DossierMedical } from '../models/dossierM.model';

@Injectable({
  providedIn: 'root'
})
export class DMEService {

  private apiUrl = 'http://localhost:5160/api/DossierM';
    
    constructor(private http: HttpClient) { }
    createDme(dossierM: DossierMedical): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/new`, dossierM, { withCredentials: true });
    }
    updateDme(id: string, dossierM: Partial<DossierMedical>): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/update/${id}`, dossierM, { withCredentials: true });
    }
}
