import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  public codeSecret: string = ''; // Code actuellement saisi
  public errorMessage: string = ''; // Message d'erreur
  public showCodeSecret: boolean = false; // Contrôle de visibilité du code secret
  public remainingAttempts: number = 3; // Nombre de tentatives restantes
  public showAttempts: boolean = false; // Contrôle de l'affichage des tentatives restantes

  constructor(
    private apiService: ApiService,
    private wsService: SocketIoService,
    private router: Router,
    private cdr: ChangeDetectorRef // Pour forcer la détection de changement
  ) {}

  ngOnInit(): void {
    // Démarre la connexion WebSocket et écoute des messages
    this.wsService.startSocketConnection().subscribe((connected) => {
      if (connected) {
        console.log('Connexion WebSocket réussie');
      } else {
        this.errorMessage = 'Impossible de se connecter au serveur WebSocket.';
      }
    });

    this.wsService.onMessage((message: string) => {
      this.handleKeyPress(message); // Gère la touche reçue via WebSocket
    });

    this.errorMessage = ''; // Réinitialiser l'erreur à l'initialisation
    this.showAttempts = false; // Masquer les tentatives restantes par défaut
  }

  // Gérer la touche appuyée via WebSocket
  private handleKeyPress(key: string): void {
    this.codeSecret += key; // Ajouter la touche reçue
    console.log('Code Secret actuel:', this.codeSecret); // Log de la valeur actuelle
    this.cdr.detectChanges(); // Forcer la détection de changement pour l'input

    // Vérification automatique lorsque 4 chiffres sont saisis
    if (this.codeSecret.length === 4) {
      this.submitCode(); // Soumettre automatiquement
    }
  }

  // Méthode appelée à chaque saisie dans le champ d'entrée
  public onCodeInput(): void {
    if (this.codeSecret.length === 4) {
      this.submitCode(); // Soumission automatique
    } else if (this.codeSecret.length < 4) {
      this.codeSecret = this.codeSecret.substring(0, 4); // Tronquer à 4 chiffres
      this.errorMessage = 'Le code ne peut contenir que 4 chiffres.';
    } else {
      this.errorMessage = ''; // Réinitialiser l'erreur si moins de 4 chiffres
    }
  }

  // Méthode pour afficher/masquer le code secret
  public togglePasswordVisibility(): void {
    this.showCodeSecret = !this.showCodeSecret;
  }

  // Validation locale du code
  public validateCodeSecret(): boolean {
    const codeSecretRegex = /^\d{4}$/; // Regex pour 4 chiffres
    if (!this.codeSecret || !codeSecretRegex.test(this.codeSecret)) {
      return false; // Code invalide
    }
    return true; // Code valide
  }

  // Soumettre et vérifier le code
  private submitCode(): void {
    // Appel API pour vérifier le code
    this.apiService.authenticateByCodeSecret(+this.codeSecret).subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response); // Log de la réponse
        const role = response?.user?.role;
        const token = response?.token;

        if (token && role) {
          localStorage.setItem('token', token); // Stocker le token
          // Redirection selon le rôle
          this.router.navigate(role === 'admin' ? ['/admin-dashboard'] : ['/user-dashboard']);
        } else {
          this.errorMessage = 'Problème avec la réponse du serveur.';
        }
      },
      error: () => {
        this.errorMessage = 'Code incorrect. Veuillez réessayer.';
        this.codeSecret = ''; // Réinitialiser le champ après une erreur
        this.remainingAttempts--; // Décrémenter les tentatives restantes
        this.showAttempts = true; // Afficher les tentatives restantes

        if (this.remainingAttempts <= 0) {
          this.router.navigate(['/login']); // Redirection après épuisement des tentatives
        }
      },
    });
  }

  // Méthode publique pour autoriser uniquement les chiffres
  public allowOnlyNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^[0-9]$/.test(key) && key !== 'Backspace') {
      event.preventDefault(); // Bloquer les saisies non numériques
    }
  }

  // Redirection vers la page de connexion
  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
