import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ArduinoDataService } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/services/arduino-data.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-daily-average-chart',
  standalone: true,
  template: `
    <div class="sensor-card">
      <h2>Moyenne quotidienne</h2>
      <canvas #dailyAverageChart></canvas> <!-- Référence du canvas -->
    </div>
  `,
  styles: [`
    .sensor-card {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  `]
})
export class DailyAverageChartComponent implements OnInit, AfterViewInit {
  private chart: Chart | null = null;
  @ViewChild('dailyAverageChart') chartRef!: ElementRef;

  constructor(private arduinoDataService: ArduinoDataService) {}

  ngOnInit() {
    // Nous n'utilisons plus loadDailyAverageData() ici car l'initialisation du chart se fait après le ngAfterViewInit.
  }

  ngAfterViewInit() {
    this.loadDailyAverageData();
  }

  loadDailyAverageData() {
    // Appel du service pour récupérer les moyennes quotidiennes
    this.arduinoDataService.getDailyAverages().subscribe((data) => {
      this.createChart(data); // Créer le graphique avec les données récupérées
    });
  }

  createChart(data: any) {
    // Si le graphique existe déjà, on le détruit pour le recréer
    if (this.chart) {
      this.chart.destroy();
    }

    // Données pour le graphique
    const chartData: ChartData = {
      labels: data.labels, // Supposons que vos données ont un attribut "labels"
      datasets: [
        {
          label: 'Température',
          data: data.temperature, // Données de température
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Humidité',
          data: data.humidity, // Données d'humidité
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }
      ]
    };

    // Configuration du graphique
    const chartConfig: ChartConfiguration = {
      type: 'line', // Type de graphique : ligne
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Moyennes quotidiennes'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Jour'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Valeur'
            }
          }
        }
      }
    };

    // Création du graphique
    this.chart = new Chart(this.chartRef.nativeElement, chartConfig);
  }
}
