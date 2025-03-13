import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{Chambre} from '../../models/chambre.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {

  private apiUrl = 'http://localhost:5160/api/Chambre';
  
  constructor(private http: HttpClient) {}

  AddChambre(chambre: Chambre): Observable<any> {
    return this.http.post(this.apiUrl, chambre);
  }
  GetChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(this.apiUrl);
  }
  GetChambreById(id: string): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/${id}`);
  }
  
  UpdateChambre(id: string, chambre: Chambre): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, chambre);
  }
}
