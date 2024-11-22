/* import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SocketIoService } from '../../services/socket-io.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-secret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-secret.component.html',
  styleUrls: ['./code-secret.component.css'],
})
export class CodeSecretComponent implements OnInit {
  public codeSecret: string [] = ['', '', '', '']; // Code actuellement saisi
  public errorMessage: string = ''; // Message d'erreur
  public showCodeSecret: boolean = false; // Contrôle de visibilité du code secret
  public remainingAttempts: number = 3; // Nombre de tentatives restantes
  public showAttempts: boolean = false; // Contrôle de l'affichage des tentatives restantes
  public isLoading: boolean = true; // État de chargement pour la connexion WebSocket
  public isSocketConnected: boolean = false;
  constructor(
    private apiService: ApiService,
    private wsService: SocketIoService, // Service WebSocket
    private router: Router,
    private cdr: ChangeDetectorRef // Pour forcer la détection de changement
  ) {}

  ngOnInit(): void {
    this.wsService.startSocketConnection().subscribe({
      next: (connected) => {
        this.isSocketConnected = connected;
        if (connected) {
          console.log('Connexion WebSocket réussie.');
          this.listenToMessages();
        }
      },
      error: (err) => {
        this.isSocketConnected = false;
        console.error('Erreur WebSocket :', err);
        this.errorMessage = 'Impossible de se connecter au serveur.';
      },
    });
  }
  private listenToMessages(): void {
    this.wsService.onMessage((message: string) => {
      console.log('Message reçu:', message);
      this.codeSecret.push(message); // Stocker les messages reçus
    });
  }

  // Gérer la touche appuyée via WebSocket
  private handleKeyPress(key: string): void {
    for (let i = 0; i < this.codeSecret.length; i++) {
      if (this.codeSecret[i] === '') {
        this.codeSecret[i] = key;
        break;
      }
    }
  
    console.log('Code Secret actuel:', this.codeSecret);
    this.cdr.detectChanges(); // Détection de changements pour l'input
  
    // Vérifiez si le tableau est complet
    if (this.codeSecret.every((value) => value !== '')) {
      this.submitCode();
    }
  }

  public onCodeInput(): void {
    if (this.codeSecret.length > 4) {
      //this.codeSecret = this.codeSecret.substring(0, 4); // Limite à 4 chiffres
      this.errorMessage = 'Le code ne peut contenir que 4 chiffres.';
    } else if (this.codeSecret.length === 4) {
      this.errorMessage = ''; // Réinitialiser les erreurs
    }
  }

  public togglePasswordVisibility(): void {
    this.showCodeSecret = !this.showCodeSecret;
  }
  private validateCodeSecret(): boolean {
    return this.codeSecret.length === 4 && this.codeSecret.every((val) => /^\d$/.test(val));
  }

  private submitCode(): void {
    if (!this.validateCodeSecret()) {
      this.errorMessage = 'Veuillez saisir un code valide.';
      return;
    }

    this.apiService.authenticateByCodeSecret(+this.codeSecret).subscribe({
      next: (response) => {
        const { role, token } = response?.user || {};
        if (token && role) {
          localStorage.setItem('token', token);
          this.router.navigate(role === 'admin' ? ['/admin-dashboard'] : ['/user-dashboard']);
        } else {
          this.errorMessage = 'Problème avec la réponse du serveur.';
        }
      },
      error: () => {
        this.remainingAttempts--;
        this.errorMessage = 'Code incorrect. Veuillez réessayer.';
        this.codeSecret = ['', '' , '', '' ];
        this.showAttempts = true;

        if (this.remainingAttempts <= 0) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  public allowOnlyNumbers(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
 */