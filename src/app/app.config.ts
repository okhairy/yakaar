import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  // Import de withFetch
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importer BrowserAnimationsModule


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
  

    importProvidersFrom(HttpClientModule),  // Ajouter HttpClientModule ici
    provideHttpClient(withFetch()),          // Ajouter withFetch() pour activer l'utilisation de fetch
    importProvidersFrom(BrowserAnimationsModule),  // Ajouter BrowserAnimationsModule
    
    provideClientHydration()
  ]
};
