import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket: Socket;
  private isSocketReady: boolean = false;

  constructor() {
    // Initialisation du socket, mais ne se connecte pas encore.
    this.socket = io('http://localhost:5000', { autoConnect: false }); // Ne pas connecter automatiquement
  }

  // Méthode pour démarrer la connexion WebSocket après un délai
  startSocketConnection(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.socket.connect(); // Connexion au WebSocket

      this.socket.on('connect', () => {
        console.log('Connexion WebSocket établie');
        this.isSocketReady = true; // Marque la connexion comme établie
        observer.next(true); // Indique que la connexion est prête
      });

      this.socket.on('connect_error', (error) => {
        console.error('Erreur WebSocket :', error);
        observer.next(false); // Si une erreur survient, marquer comme échec
      });

      // Timeout si la connexion prend trop de temps
      setTimeout(() => {
        if (!this.isSocketReady) {
          observer.next(false);
          console.error('La connexion WebSocket a échoué après un certain délai');
        }
      }, 10000); // 10 secondes de délai maximum
    }).pipe(delay(500)); // Laissez un léger délai pour les autres initialisations avant de retourner le statut
  }

  // Méthode pour écouter les messages du serveur
  onMessage(callback: (message: string) => void): void {
    this.socket.on('message', (data: string) => {
      console.log('Message reçu du serveur:', data); // Debug pour voir ce qui est envoyé
      callback(data); // Passer les données au callback fourni
    });
  }

  // Méthode pour envoyer des messages au serveur
  sendMessage(message: string): void {
    if (this.socket.connected) {
      console.log('Envoi du message au serveur:', message); // Debug pour voir ce qui est envoyé
      this.socket.emit('keypadData', message); // Envoie des données avec l'événement 'keypadData'
    } else {
      console.error('Le serveur WebSocket n\'est pas connecté');
    }
  }
}
