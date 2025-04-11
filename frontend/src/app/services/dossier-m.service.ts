import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{DossierMedical} from '../models/dossierM.model'

@Injectable({
  providedIn: 'root'
})
export class DossierMService {
  private apiUrl = 'http://localhost:5160/api/DossierM';

  constructor(private http: HttpClient) { }

  getDossier(): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.apiUrl}`,{ withCredentials: true });
  }
  getDossierM(patientId: string): Observable<DossierMedical> {
    return this.http.get<DossierMedical>(`${this.apiUrl}/medecin`,{ 
      params: { patientId },
      withCredentials: true 
    });
  }
  ajouterAnalyse(dossierId: string, fichier: File, nom: string): Observable<any> {
    const formData = new FormData();
    formData.append('dossierId', dossierId);
    formData.append('fichier', fichier);
    formData.append('nom', nom);

    return this.http.post(`${this.apiUrl}/ajouteranalyse`, formData);
  }
  telechargerAnalyse(dossierId: string, fichierUrl: string): Observable<Blob> {
    const url = `${this.apiUrl}/telecharger-analyse?dossierId=${dossierId}&fichierUrl=${encodeURIComponent(fichierUrl)}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
