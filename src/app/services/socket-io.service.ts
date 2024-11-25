import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket!: Socket;

  constructor(private ngZone: NgZone) {}

  // Initialise la connexion au WebSocket
  public startSocketConnection(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.ngZone.runOutsideAngular(() => {
        try {
          console.log('Tentative de connexion WebSocket...');
          this.socket = io('http://localhost:5000'); // Assurez-vous que l'URL est correcte
          this.socket.on('connect', () => {
            console.log('WebSocket connecté avec succès.');
            this.ngZone.run(() => {
              observer.next(true);
              observer.complete();
            });
          });

          this.socket.on('connect_error', (err: any) => {
            console.error('Erreur de connexion au WebSocket :', err);
            this.ngZone.run(() => observer.error(err));
          });
        } catch (error) {
          console.error('Exception lors de la connexion WebSocket :', error);
          this.ngZone.run(() => observer.error(error));
        }
      });
    });
  }

  // Écoute des messages WebSocket
  public onMessage(callback: (message: string) => void): void {
    if (this.socket) {
      console.log('Écoute des messages WebSocket démarrée...');
      this.ngZone.runOutsideAngular(() => {
        this.socket.on('keypad-input', (message: string) => {
          console.log('Message reçu depuis le WebSocket :', message); // Vérifier que le message est reçu
          this.ngZone.run(() => callback(message));
        });
      });
    } else {
      console.warn('WebSocket non connecté : Impossible d\'écouter les messages.');
    }
  }
  
  // Déconnexion du WebSocket
  public disconnectSocket(): void {
    if (this.socket) {
      console.log('Déconnexion du WebSocket...');
      this.socket.disconnect();
    }
  }
}
