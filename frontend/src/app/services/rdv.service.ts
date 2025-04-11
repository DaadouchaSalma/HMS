import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RendezVous} from '../../app/models/rdv.model'
import { Medecin } from '../models/medecin.model';
@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private apiUrl = 'http://localhost:5160/api/rendezvous';
  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la liste des médecins
  getMedecins(): Observable<Medecin[]> {
      return this.http.get<Medecin[]>('http://localhost:5160/api/medecin',{ withCredentials: true });
    }

    addRendezVous(rendezVous: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/add`, {
        ...rendezVous,
        date_RDV: rendezVous.date_RDV, 
        time_RDV: rendezVous.time_RDV 
      },{ withCredentials: true });
    }
  
    getDisponibilites(medecinId: string, date_RDV: string): Observable<string[]> {
      return this.http.get<string[]>(`http://localhost:5160/api/rendezvous/disponibilites`, {
        params: { 
          medecinId: medecinId, 
          date_RDV: date_RDV 
        }
      });
    }
    

    deleteRendezVous(id: string): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}/${id}`,{ withCredentials: true });
  }
  getRendezVousByPatientId(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient`,{ withCredentials: true });
  }

  getNotifications(patientId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/notifications/${patientId}`);
  }
  


  ajouterALaListeAttente(rdv: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addAttente`, rdv,{ withCredentials: true });
  }

}
