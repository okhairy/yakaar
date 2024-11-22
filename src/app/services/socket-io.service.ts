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
      this.socket.connect(); // Connexion WebSocket
      let connectionTimeout = setTimeout(() => {
        if (!this.isSocketReady) {
          observer.error('Connexion WebSocket échouée : Timeout');
          console.error('Timeout de la connexion WebSocket');
          observer.complete();
        }
      }, 10000); // Timeout après 10 secondes
  
      this.socket.on('connect', () => {
        clearTimeout(connectionTimeout); // Annule le timeout
        console.log('Connexion WebSocket établie');
        this.isSocketReady = true;
        observer.next(true);
        observer.complete(); // Émission unique
      });
  
      this.socket.on('connect_error', (error) => {
        clearTimeout(connectionTimeout); // Annule le timeout
        console.error('Erreur de connexion WebSocket :', error);
        observer.error(error);
        observer.complete(); // Complétez après erreur
      });
    });
  }

  // Méthode pour écouter les messages du serveur
  onMessage(callback: (message: string) => void): void {
    this.socket.on('keypadData', (data: string) => {
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

  // Méthode pour fermer proprement la connexion WebSocket
  disconnectSocket(): void {
    if (this.socket.connected) {
      this.socket.disconnect(); // Fermer la connexion proprement
      console.log('WebSocket déconnecté');
    }
  }
}
