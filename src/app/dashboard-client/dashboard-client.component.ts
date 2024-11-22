import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})
export class DashboardClientComponent implements OnInit {
  ngOnInit() {
    this.createDonutChart();
  }

  createDonutChart() {
    const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Température', 'Humidité'],
        datasets: [{
          data: [20, 25],
          backgroundColor: [
            '#36A2EB',
            '#0000FF'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}