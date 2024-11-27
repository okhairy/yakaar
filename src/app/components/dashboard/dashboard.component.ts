/* import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArduinoDataService } from '../services/arduino-data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="sensor-grid">
        <div class="sensor-card temperature">
          <h2>Température</h2>
          <div class="sensor-value">
            {{ currentTemperature | number:'1.1-1' }}°C
            <small>{{ temperatureTime }}</small>
          </div>
        </div>
        
        <div class="sensor-card humidity">
          <h2>Humidité</h2>
          <div class="sensor-value">
            {{ currentHumidity | number:'1.1-1' }}%
            <small>{{ humidityTime }}</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      background-color: #f4f7f6;
    }
    .sensor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .sensor-card {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .sensor-value {
      font-size: 2.5em;
      font-weight: bold;
      color: #2c3e50;
    }
  `]
})
export default class DashboardComponent implements OnInit {
  currentTemperature: number = 0;
  currentHumidity: number = 0;
  temperatureTime: string = '';
  humidityTime: string = '';

  constructor(private arduinoService: ArduinoDataService) {}

  ngOnInit() {
    this.fetchSensorData();
  }

  private fetchSensorData() {
    // Récupération de la température
    this.arduinoService.getTemperature().subscribe({
      next: (data) => {
        this.currentTemperature = data.value;
        this.temperatureTime = data.time;
      },
      error: (err) => console.error('Erreur température', err)
    });

    // Récupération de l'humidité
    this.arduinoService.getHumidity().subscribe({
      next: (data) => {
        this.currentHumidity = data.value;
        this.humidityTime = data.time;
      },
      error: (err) => console.error('Erreur humidité', err)
    });
  }
} */
  //import { Component, OnInit } from '@angular/core';
  import { CurrentSensorDataComponent } from '/home/oumoul-khairy/oumou/src/app/components/current-sensor-data/current-sensor-data.component'
  import { HourlyDataComponent } from '/home/oumoul-khairy/oumou/src/app/hourly-data/hourly-data.component';
  //import { DailyAverageChartComponent } from '/home/oumoul-khairy/oumou/src/app/daily-average-chart/daily-average-chart.component';
  import { ArduinoDataService } from '/home/oumoul-khairy/oumou/src/app/services/arduino-data.service';
  import { DailyAverageChartComponent } from '../daily-average-chart/daily-average-chart.component'; // Assurez-vous de bien l'importer
  import { Component, CUSTOM_ELEMENTS_SCHEMA,OnInit } from '@angular/core';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
      CurrentSensorDataComponent,
      HourlyDataComponent,
      DailyAverageChartComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ajoutez cette ligne
    template: `
      <div class="dashboard-container">
        <app-current-sensor-data></app-current-sensor-data>
        <app-hourly-data></app-hourly-data>
        <app-daily-average-chart></app-daily-average-chart>
      </div>
    `,
    styles: [`
      .dashboard-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
        padding: 20px;
      }
    `]
  })

  
  export class DashboardComponent implements OnInit {
    constructor(private arduinoDataService: ArduinoDataService) {}
  
    ngOnInit() {
      // Charger les données initiales
      this.loadData();
    }
  
    loadData() {
      // Récupérer les données depuis le service Arduino
      // et les passer aux sous-composants
    }
  }