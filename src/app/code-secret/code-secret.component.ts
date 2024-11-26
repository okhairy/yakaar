import {
  Component,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { WebSocketService } from '../services/websocket.service'; // Import du service WebSocket
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; // Pour gérer les abonnements

@Component({
  selector: 'app-code-secret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-secret.component.html',
  styleUrls: ['./code-secret.component.css'],
})
export class CodeSecretComponent implements AfterViewInit, OnDestroy {
  public codeSecret: string = ''; // Code actuellement saisi
  public errorMessage: string = ''; // Message d'erreur
  public showCodeSecret: boolean = false; // Contrôle de visibilité du code secret
  public remainingAttempts: number = 3; // Nombre de tentatives restantes
  public showAttempts: boolean = false; // Contrôle de l'affichage des tentatives restantes
  private isBrowser: boolean; // Vérifie si le code s'exécute côté navigateur
  private webSocketSubscription?: Subscription; // Gestion de l'abonnement WebSocket

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService, // Injection du WebSocketService
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      console.log('ngAfterViewInit appelé côté navigateur.');

      // Abonnement au service WebSocket
      this.webSocketSubscription = this.webSocketService
        .listen('code-secret') // Écoute des événements 'code-secret'
        .subscribe({
          next: (data: string) => {
            console.log('Données reçues via WebSocket :', data);
            this.handleKeyPress(data.trim()); // Gère chaque touche reçue
          },
          error: (err) => {
            console.error('Erreur WebSocket :', err);
            this.errorMessage = 'Erreur de connexion WebSocket.';
          },
        });
    }
  }

  public handleKeyPress(key: string): void {
    console.log('Touche reçue :', key);
  
    // Valider que c'est une touche numérique
    if (!/^\d$/.test(key)) {
      console.warn(`Touche non valide ignorée : ${key}`);
      return;
    }
  
    // Ajouter la touche si le code secret est encore incomplet
    if (this.codeSecret.length < 4) {
      this.codeSecret += key; 
      console.log('Code Secret mis à jour :', this.codeSecret);
  
      // Force la détection des changements
      this.cdr.detectChanges();
    }
  
    // Si le code atteint 4 caractères, soumettre automatiquement
    if (this.codeSecret.length === 4) {
      this.submitCode();
    }
  }
  
  

  public onCodeInput(): void {
    if (this.codeSecret.length > 4) {
      this.codeSecret = this.codeSecret.substring(0, 4);
    }

    if (this.codeSecret.length === 4) {
      this.submitCode();
    }
  }

  public togglePasswordVisibility(): void {
    this.showCodeSecret = !this.showCodeSecret;
  }

  private submitCode(): void {
    this.apiService.authenticateByCodeSecret(+this.codeSecret).subscribe({
      next: (response) => {
        const role = response?.user?.role;
        const token = response?.token;

        if (token && role) {
          localStorage.setItem('token', token);
          this.router.navigate(
            role === 'admin' ? ['/admin-dashboard'] : ['/user-dashboard']
          );
        } else {
          this.errorMessage = 'Problème avec la réponse du serveur.';
        }
      },
      error: () => {
        this.errorMessage = 'Code incorrect. Veuillez réessayer.';
        this.codeSecret = '';
        this.remainingAttempts--;
        this.showAttempts = true;

        if (this.remainingAttempts <= 0) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  public allowOnlyNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^[0-9]$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    console.log('Composant détruit.');
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe(); // Désabonnement du service WebSocket
    }
  }
}
