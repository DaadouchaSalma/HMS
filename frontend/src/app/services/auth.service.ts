import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse  } from '@angular/common/http';
import { catchError, throwError, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5160/api/auth'; 
  isAuthenticated= false;

  constructor(private http: HttpClient, private router: Router) {}

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, {withCredentials: true});
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {withCredentials: true});
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : [];
  }

  isLoggedIn(): boolean {
    const roles = localStorage.getItem('userRoles');
    return !!roles;
  }   
}
