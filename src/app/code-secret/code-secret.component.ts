import { Component, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SocketIoService } from '../services/socket-io.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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


 constructor(
   private apiService: ApiService,
   private wsService: SocketIoService,
   private router: Router,
   private cdr: ChangeDetectorRef,
   @Inject(PLATFORM_ID) private platformId: Object
 ) {
   this.isBrowser = isPlatformBrowser(platformId);
 }


 ngAfterViewInit(): void {
   if (this.isBrowser) {
     console.log('ngAfterViewInit appelé côté navigateur : Initialisation du WebSocket.');
     setTimeout(() => {
       this.initializeWebSocketConnection();
     }, 100);
   }
 }


 private initializeWebSocketConnection(): void {
   this.wsService.startSocketConnection().subscribe({
     next: (connected) => {
       if (connected) {
         console.log('Connexion WebSocket réussie');
         this.listenToWebSocketMessages();
       }
     },
     error: (err) => {
       this.errorMessage = 'Impossible de se connecter au serveur WebSocket.';
       console.error(err);
     },
   });
 }


 private listenToWebSocketMessages(): void {
   console.log('Écoute des messages WebSocket démarrée...');
   this.wsService.onMessage((message: string) => {
     console.log('Message reçu :', message);
     this.handleKeyPress(message);
   });
 }


 public handleKeyPress(key: string): void {
   console.log('Touche reçue :', key);
   if (!/^\d$/.test(key)) {
     console.warn(`Touche non valide ignorée : ${key}`);
     return;
   }
    if (this.codeSecret.length < 4) {
     this.codeSecret += key;
     console.log('Code Secret actuel :', this.codeSecret);
     this.cdr.detectChanges(); // Met à jour l'interface
   }
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
         this.router.navigate(role === 'admin' ? ['/admin-dashboard'] : ['/user-dashboard']);
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
   if (this.isBrowser) {
     console.log('Déconnexion du WebSocket...');
     this.wsService.disconnectSocket();
   }
 }
}
