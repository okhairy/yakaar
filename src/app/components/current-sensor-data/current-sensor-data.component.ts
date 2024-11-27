import { Component, OnInit } from '@angular/core';
import { ArduinoDataService, SensorData } from '/home/oumoul-khairy/oumou/src/app/services/arduino-data.service';

@Component({
  selector: 'app-current-sensor-data',
  standalone:true,
  template: `
    <div class="sensor-card">
      <h2>Données actuelles</h2>
      <div class="sensor-value">
        <div>
          <span>Température:</span>
          <span>{{ currentTemperature }}°C</span>
        </div>
        <div>
          <span>Humidité:</span>
          <span>{{ currentHumidity }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sensor-card {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .sensor-value {
      display: flex;
      justify-content: space-between;
      font-size: 1.2em;
      font-weight: bold;
    }
  `]
})
export class CurrentSensorDataComponent implements OnInit {
  currentTemperature: number = 0;
  currentHumidity: number = 0;

  constructor(private arduinoDataService: ArduinoDataService) {}

  ngOnInit() {
    this.loadCurrentSensorData();
  }

  loadCurrentSensorData() {
    this.arduinoDataService.getTemperature().subscribe((data: SensorData) => {
      this.currentTemperature = data.value;
    });
    this.arduinoDataService.getHumidity().subscribe((data: SensorData) => {
      this.currentHumidity = data.value;
    });
  }
}