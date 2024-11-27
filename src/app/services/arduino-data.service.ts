 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Définition des interfaces pour les données du capteur
export interface SensorData {
  temperature: number;
  humidity: number;
  value:number
  time: string;  // ou une autre propriété, selon la structure des données retournées
}

export interface RealTimeSensorData {
  temperature: SensorData;
  humidity: SensorData;
}

@Injectable({
  providedIn: 'root'
})
export class ArduinoDataService {
  private apiBaseUrl = 'http://localhost:3002/api/data';  // Assurez-vous que votre API fonctionne

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir la température actuelle
  getTemperature(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiBaseUrl}/temperature`);
  }

  // Méthode pour obtenir l'humidité actuelle
  getHumidity(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiBaseUrl}/humidity`);
  }

  // Méthode pour obtenir les moyennes quotidiennes
  getDailyAverages(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/daily-averages`);
  }

  // Méthode pour obtenir les données hebdomadaires
  getWeeklyData(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/weekly`);
  }

  // Méthode pour obtenir des mises à jour en temps réel pour température et humidité
  getRealTimeSensorData(interval_ms: number = 5000): Observable<RealTimeSensorData> {
    return interval(interval_ms).pipe(
      switchMap(() => {
        return this.http.get<RealTimeSensorData>(`${this.apiBaseUrl}/current`);
      })
    );
  }
  //methode pour recuperer a une heure specifique
  getDataForHour(hour: string): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiBaseUrl}/hourly/${hour}`);
  }
}
 

