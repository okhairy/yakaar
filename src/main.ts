//import { bootstrapApplication } from '@angular/platform-browser';
//import { DashboardClientComponent } from './app/dashboard-client/dashboard-client.component';

//bootstrapApplication(DashboardClientComponent);
//routes
// main.ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/app.routes';  // Vérifie que le chemin relatif est correct
import { LoginComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/login/login.component';  // Vérifie que ce fichier existe à ce chemin
//import { AdminDashboardComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/dashboard-client/dashboard-client.component';  // Vérifie
import { DashboardComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/components/dashboard/dashboard.component';  
import { CodeSecretComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/code-secret/code-secret.component';  // Vérifie


// Démarrage de l'application avec les routes
bootstrapApplication(DashboardComponent, {
  providers: [
    provideRouter(routes)  // Fournir les routes à Angular
  ]
});
