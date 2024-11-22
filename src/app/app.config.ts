import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  // Import de withFetch
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),  // Ajouter HttpClientModule ici
    provideHttpClient(withFetch()),          // Ajouter withFetch() pour activer l'utilisation de fetch
    provideRouter(routes),
    provideClientHydration()
  ]
};
