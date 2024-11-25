import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Le service est fourni globalement
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/users/login';  // URL de l'API Node.js

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer le code secret à l'API
  authenticate(secretCode: string): Observable<any> {
    return this.http.post(this.apiUrl, { secretCode });
  }
}
