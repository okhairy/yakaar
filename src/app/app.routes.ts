import { Routes } from '@angular/router';



export const routes: Routes = [
 
  
  {
    path: 'gestion-utilisateur',
    loadComponent: () => import('./gestion-utilisateur/gestion-utilisateur.component')
      .then(m => m.GestionUtilisateurComponent)
  }
];