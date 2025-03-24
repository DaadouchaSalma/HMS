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
    return this.http.get<CategorieMedicament[]>(this.apiUrl);
  }

  getCategorieById(id: string): Observable<CategorieMedicament> {
    return this.http.get<CategorieMedicament>(`${this.apiUrl}/${id}`);
  }

  addCategorie(Categorie: CategorieMedicament): Observable<CategorieMedicament> {
    return this.http.post<CategorieMedicament>(this.apiUrl, Categorie);
  }
  updateCategorie(id: string, Categorie: CategorieMedicament): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, Categorie);
  }

  deleteCategorie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


