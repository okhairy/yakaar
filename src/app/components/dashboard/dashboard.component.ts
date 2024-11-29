import { Component, OnInit } from '@angular/core';
import { ArduinoDataService } from '/home/oumoul-khairy/oumou/src/app/services/arduino-data.service';
import { DataService } from '/home/oumoul-khairy/oumou/src/app/data.service';  
import { CurrentSensorDataComponent } from '/home/oumoul-khairy/oumou/src/app/components/current-sensor-data/current-sensor-data.component';
import { DataDisplayComponent } from '/home/oumoul-khairy/oumou/src/app/components/data-display/data-display.component';
import { DailyAverageComponent } from '/home/oumoul-khairy/oumou/src/app/daily-average/daily-average.component';
import { FanComponent } from '/home/oumoul-khairy/oumou/src/app/fan/fan.component'; // Import du FanComponent
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrentSensorDataComponent,
    DataDisplayComponent,
    DailyAverageComponent,
    FanComponent // Ajoutez FanComponent ici
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="dashboard-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img src="assets/logo.png" alt="Yakar Logo" />
        </div>
       
        <button class="logout-btn">Déconnexion</button>
      </aside>

      <!-- Main Dashboard Content -->
      <main class="dashboard-content">
        <header class="header">
          <div class="user-info">
            <img src="assets/logo.png" alt="User Profile" />
            <span>user name</span>
          </div>
        </header>
        <div class="dashboard-container">
          <app-current-sensor-data></app-current-sensor-data>  <!-- En haut -->
          <app-fan [isOn]="currentTemperature > 27"></app-fan> <!-- Ventilateur en dessous -->
          <app-data-display></app-data-display>                 <!-- Au milieu -->
          <app-daily-average></app-daily-average>               <!-- En bas -->
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Variables pour stocker les données
  currentTemperature: number = 0;
  currentHumidity: number = 0;
  temperatureTime: string = '';
  humidityTime: string = '';

  constructor(
    private arduinoDataService: ArduinoDataService,
    private dataService: DataService  
  ) {}

  ngOnInit() {
    // Charger les données initiales
    this.loadData();
  }

  loadData() {
    // Récupérer les données depuis le service Arduino
    this.arduinoDataService.getTemperature().subscribe({
      next: (data) => {
        this.currentTemperature = data.value;
        this.temperatureTime = data.time;
      },
      error: (err) => console.error('Erreur température', err)
    });

    this.arduinoDataService.getHumidity().subscribe({
      next: (data) => {
        this.currentHumidity = data.value;
        this.humidityTime = data.time;
      },
      error: (err) => console.error('Erreur humidité', err)
    });

    // Vérification de l'heure actuelle pour récupérer les données spécifiques
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    // Si l'heure actuelle est 12h10, 12h11 ou 12h12, on récupère les données
    if (currentHour === 12 && [10, 11, 12].includes(currentMinute)) {
      this.dataService.getDataByHour('12').subscribe({
        next: (data) => {
          // Logique pour gérer les données récupérées
          console.log(`Données récupérées pour l'heure ${currentHour}:${currentMinute}:`, data);
        },
        error: (err) => console.error('Erreur récupération données par heure', err)
      });
    }
  }
} 