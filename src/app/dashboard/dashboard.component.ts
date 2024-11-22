import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class DashboardComponent implements AfterViewInit {
  temperature = 25;
  humidity = 60;
  fanStatus = false;
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;

  ngAfterViewInit() {
    this.initializeChart();
  }

  toggleFan() {
    console.log(`Le ventilateur est ${this.fanStatus ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
  }
initializeDoughnutChart() {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('historyChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'doughnut', // Changer le type en doughnut pour le diagramme circulaire
        data: {
          labels: ['Température', 'Humidité'],
          datasets: [
            {
              label: 'Moyenne quotidienne',
              data: [this.temperature, this.humidity], // Utiliser les valeurs de température et d'humidité
              backgroundColor: ['#34b3ff', '#001f8f'], // Couleurs pour température et humidité
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Moyenne quotidienne',
            },
          },
        },
      });
    }
}
  initializeChart() {
    if (typeof document !== 'undefined') {
      const ctx = document.getElementById('historyChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [
            {
              label: 'Température',
              data: [25, 24, 26, 27, 28, 29, 30],
              borderColor: '#34b3ff',
              fill: false,
            },
            {
              label: 'Humidité',
              data: [60, 58, 62, 63, 61, 65, 64],
              borderColor: '#4ac76f',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}