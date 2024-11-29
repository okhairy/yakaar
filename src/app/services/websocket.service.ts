import { ApplicationRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor(private appRef: ApplicationRef) {
    // Configure l'URL du serveur WebSocket
    this.socket = io('http://localhost:5000/', { autoConnect: false });

    // Attends que l'application soit stable avant de connecter le WebSocket
    this.appRef.isStable
      .pipe(first((isStable) => isStable))
      .subscribe(() => {
        console.log('Application stable, connexion WebSocket...');
        this.socket.connect();
      });
  }

  public listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
