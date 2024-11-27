import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ApplicationRef } from '@angular/core';
import { first } from 'rxjs/operators';

interface TemperatureData {
  temperature: number;
  humidity: number;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private socket = io('http://localhost:5000');
  private apiUrl = 'http://localhost:5000/api';
  private dataSubject = new Subject<TemperatureData>();

  
  
  constructor(private  appRef: ApplicationRef, private http: HttpClient,) {
    // Assurez-vous que l'URL de votre serveur WebSocket est correcte
    this.socket = io('http://localhost:5000/', { autoConnect: false}); // Remplacez par l'URL de votre serveur

    // Attendre que l'application soit stable avant de connecter le WebSocket
    this.appRef.isStable
    .pipe(first((isStable) => isStable))
    .subscribe(() => {
      this.socket.connect(); // Connexion du socket après la stabilité
    });
    this.setupSocketListeners();
  }

  // Configuration des écouteurs Socket.IO
  private setupSocketListeners() {
    this.socket.on('sensor-data', (data: TemperatureData) => {
      this.dataSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO');
    });
  }

  // Récupération des données en temps réel via WebSocket
  getRealTimeData(): Observable<TemperatureData> {
    return this.dataSubject.asObservable();
  }

  // Récupération des données historiques via API REST
  getHistoricalData(hours: number[]): Observable<TemperatureData[]> {
    return this.http.get<TemperatureData[]>(`${this.apiUrl}/historical-data`, {
      params: { hours: hours.join(',') }
    });
  }

  // Méthode pour obtenir la dernière donnée
  getLatestData(): Observable<TemperatureData> {
    return this.http.get<TemperatureData>(`${this.apiUrl}/latest-data`);
  }
}