//import { bootstrapApplication } from '@angular/platform-browser';
//import { DashboardComponent } from './app/dashboard/dashboard.component';

//bootstrapApplication(DashboardComponent)
 // .catch(err => console.error(err));
 import { Component } from '@angular/core';
 
 import { bootstrapApplication } from '@angular/platform-browser';
 import { provideRouter } from '@angular/router';
 import { routes } from './app/app.routes';  
 import { LoginComponent } from './app/login/login.component';  // Vérifie que ce fichier existe à ce chemin
 import { DashboardComponent } from './app/dashboard/dashboard.component';
// import { DashboardClientComponent } from '/app/dashboard-client/dashboard-client.component';  // Vérifie
 import { CodeSecretComponent } from './app/auth/code-secret/code-secret.component';  // Vérifie
 
 
 // Démarrage de l'application avec les routes
 bootstrapApplication(DashboardComponent, {
   providers: [
     provideRouter(routes)  // Fournir les routes à Angular
   ]
 });
