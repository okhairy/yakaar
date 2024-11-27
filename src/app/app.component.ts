/* import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';


@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [DashboardClientComponent], // Ajoutez le Dashboard ici
})
export class AppComponent {
  title = 'yakaar';
  showDashboard = true; // Passez à "true" pour afficher le Dashboard
}
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importation nécessaire pour le routage

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',  // Template de l'application
  styleUrls: ['./app.component.css'],   // Fichier CSS
  imports: [RouterOutlet],              // Assure-toi que RouterOutlet est importé ici
})
export class AppComponent {
  title = 'yakaar';
}
