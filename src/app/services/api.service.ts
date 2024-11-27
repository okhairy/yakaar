import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Créer un en-tête avec le token si disponible
  private getAuthHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }
  

  // -------- UTILISATEURS --------

  // Authentifier un utilisateur par email et mot de passe
  authenticateUser(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/authentifier`, { email, motDePasse })
      .pipe(
        timeout(10000),  // Timeout de 10 secondes
        catchError(this.handleError));
  }

  // Authentifier un utilisateur par code secret
  authenticateByCodeSecret(codeSecret: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/authentifier/code-secret`, { codeSecret })
      .pipe(
        timeout(10000),  // Timeout de 10 secondes
        catchError(this.handleError));
  }


  // Créer un nouvel utilisateur (admin uniquement)
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/inscrire`, user, { headers: this.getAuthHeaders() })
      .pipe(
        timeout(10000),  // Timeout de 10 secondes
        catchError(error => {
          let errorMessage = 'Une erreur est survenue.';

          if (error.status === 400) {
            // Si l'erreur est de type 400, cela peut signifier une erreur liée aux validations
            if (error.error && error.error.error) {
              errorMessage = error.error.error;  // Utiliser le message d'erreur spécifique envoyé par le backend
            
             // Message d'erreur spécifique pour l'email, le téléphone ou le code secret
             if (error.error.error === 'L\'email est déjà utilisé') {
              errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
            } else if (error.error.error === 'Le téléphone est déjà utilisé') {
              errorMessage = 'Ce numéro de téléphone est déjà utilisé. Veuillez en choisir un autre.';
            } else if (error.error.error === 'Le code secret est déjà utilisé') {
              errorMessage = 'Ce code secret est déjà utilisé. Veuillez en choisir un autre.';
            }
          }
          } else if (error.status === 500) {
            errorMessage = 'Problème serveur. Veuillez réessayer plus tard.';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Mettre à jour un utilisateur existant (admin uniquement)
  updateUser(userId: string, updateuser: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update/${userId}`, updateuser, { headers: this.getAuthHeaders() })
    .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));  }




      

  // Supprimer un utilisateur par ID (admin uniquement)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/supprimer/${userId}`, { headers: this.getAuthHeaders() })
    .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));  }

  // Récupérer tous les utilisateurs (admin uniquement)
 getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get-all`, { headers: this.getAuthHeaders() })
    .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));  }

  // Récupérer un utilisateur par ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/get/${userId}`, { headers: this.getAuthHeaders() })
    .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));  }

  // Récupérer les utilisateurs avec pagination
  getUsers(page: number = 1, limit: number = 8): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get(`${this.baseUrl}/user/get-all`, { 
      params,
      headers: this.getAuthHeaders() 
    }) .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));
  }

  
  
  // Changer le rôle d'un utilisateur
  toggleUserRole(userId: string, newRole: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/user/changer-role/${userId}`, { role: newRole }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Mettre à jour le statut d'un utilisateur (actif/inactif)
  updateUserStatus(userId: string, status: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update-status/${userId}`, 
      { status }, 
      { headers: this.getAuthHeaders() }
    ) .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));
  }

  // Rechercher des utilisateurs
  searchUsers(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.baseUrl}/user/search`, {
      params,
      headers: this.getAuthHeaders()
    }) .pipe(
      timeout(10000),  // Timeout de 10 secondes
      catchError(this.handleError));
  }

  // -------- COLLECTES --------

  // Récupérer toutes les collectes avec pagination et filtres (dates)
  getCollectes(page: number, limit: number, startDate?: string, endDate?: string): Observable<any> {
    let params: any = { page, limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get(`${this.baseUrl}/collecte/get-all`, { 
      params, 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }

  // Créer une nouvelle collecte
  createCollecte(collecte: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/collecte/creer`, collecte, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }

  // Récupérer une collecte spécifique par ID
  getCollecteById(collecteId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/collecte/get/${collecteId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
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
 // Dans ton service API
private handleError(error: any): Observable<never> {
  console.error('Une erreur est survenue :', error);

  let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
  // Vérifie si une erreur détaillée est fournie par le backend
  if (error.error && error.error.message) {
    errorMessage = error.error.message;
  }

  // Retourne l'erreur pour la capturer dans le composant
  return throwError(() => new Error(errorMessage));
}

}