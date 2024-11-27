import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://votre-api.com/sensors'; // Remplacez par votre URL API

  constructor(private http: HttpClient) {}

  getSensorData(): Observable<{ temperature: number; humidity: number }> {
    return this.http.get<{ temperature: number; humidity: number }>(this.apiUrl);
  }
}
