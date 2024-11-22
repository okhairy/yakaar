import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  inscrireUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscrire`, userData);
  }

  authentifier(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentifier`, credentials);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  supprimerUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}