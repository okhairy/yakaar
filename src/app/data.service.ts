import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SensorData {
  value: number;
  time: string;
}

export interface HourData {
  temperature: number;
  humidity: number;
  hour: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3002/api/data';

  constructor(private http: HttpClient) {}

  getCurrentHumidity(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/humidity`);
  }

  getCurrentTemperature(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/temperature`);
  }

  getHourData(hour: string): Observable<HourData> {
    return this.http.get<HourData>(`${this.apiUrl}/data/${hour}`);
  }
}