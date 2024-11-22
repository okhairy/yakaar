import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { HttpClientModule } from '@angular/common/http';  // Import de HttpClientModule
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    importProvidersFrom(HttpClientModule)  // Ajout de HttpClientModule ici
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
