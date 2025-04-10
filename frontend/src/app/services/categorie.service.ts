import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieMedicament } from '../models/categorie.model';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://localhost:5160/api/Categorie'; // Adjust URL


  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategorieMedicament[]> {
    return this.http.get<CategorieMedicament[]>(this.apiUrl , { withCredentials: true });
  }

  getCategorieById(id: string): Observable<CategorieMedicament> {
    return this.http.get<CategorieMedicament>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  addCategorie(Categorie: CategorieMedicament): Observable<CategorieMedicament> {
    return this.http.post<CategorieMedicament>(this.apiUrl, Categorie, { withCredentials: true });
  }
  updateCategorie(id: string, Categorie: CategorieMedicament): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, Categorie, { withCredentials: true });
  }

  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}


