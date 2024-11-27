import { Component, OnInit } from '@angular/core';
import { ArduinoDataService, SensorData } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/services/arduino-data.service';

@Component({
  selector: 'app-hourly-data',
  standalone:true,
  template: `
    <div class="sensor-card">
      <h2>Données horaires</h2>
      <div class="sensor-value">
        <div>
          <span>12h10:</span>
          <span>{{ data12h10?.temperature }}°C / {{ data12h10?.humidity }}%</span>
        </div>
        <div>
          <span>12h11:</span>
          <span>{{ data12h11?.temperature }}°C / {{ data12h11?.humidity }}%</span>
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
      flex-direction: column;
      gap: 10px;
      font-size: 1.2em;
      font-weight: bold;
    }
  `]
})
export class HourlyDataComponent implements OnInit {
  data12h10: SensorData | null = null;
  data12h11: SensorData | null = null;

  constructor(private arduinoDataService: ArduinoDataService) {}

  ngOnInit() {
    this.loadHourlyData();
  }

  loadHourlyData() {
    this.arduinoDataService.getDataForHour('12h10').subscribe((data) => {
      this.data12h10 = data;
    });
    this.arduinoDataService.getDataForHour('12h11').subscribe((data) => {
      this.data12h11 = data;
    });
  }
}
