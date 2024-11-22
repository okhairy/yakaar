import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Créer un en-tête avec le token si disponible
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // -------- UTILISATEURS --------

  // Authentifier un utilisateur par email et mot de passe
  authenticateUser(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/authentifier`, { email, motDePasse })
      .pipe(catchError(this.handleError));
  }

  // Authentifier un utilisateur par code secret
  authenticateByCodeSecret(codeSecret: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/authentifier/code-secret`, { codeSecret })
      .pipe(catchError(this.handleError));
  }

  // Créer un nouvel utilisateur (admin uniquement)
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/inscrire`, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour un utilisateur existant (admin uniquement)
  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update/${userId}`, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un utilisateur par ID (admin uniquement)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/supprimer/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Récupérer tous les utilisateurs (admin uniquement)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get-all`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Récupérer un utilisateur par ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // -------- COLLECTES --------

  // Récupérer toutes les collectes avec pagination et filtres (dates)
  getCollectes(page: number, limit: number, startDate?: string, endDate?: string): Observable<any> {
    let params: any = { page, limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get(`${this.baseUrl}/collecte/get-all`, { params, headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Créer une nouvelle collecte
  createCollecte(collecte: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/collecte/creer`, collecte, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Récupérer une collecte spécifique par ID
  getCollecteById(collecteId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/collecte/get/${collecteId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Récupérer la moyenne journalière (température et humidité)
  getDailyAverage(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/collecte/moyenne-journaliere`, {
      params: { date },
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Récupérer l'historique hebdomadaire
  getWeeklyHistory(startDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/collecte/historique-hebdomadaire`, {
      params: { startDate },
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Gestion des erreurs API
  private handleError(error: any): Observable<never> {
    // Afficher l'erreur dans la console pour le débogage
    console.error('Une erreur est survenue :', error);

    // Vous pouvez personnaliser le message d'erreur ici selon le type d'erreur
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    // Retourner une erreur observable avec un message personnalisé
    return throwError(errorMessage);
  }
}
