import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CodeSecretComponent } from './auth/code-secret/code-secret.component';




export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'login', component: LoginComponent },
  { path: 'auth/code-secret', component: CodeSecretComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  {
    path: 'gestion-utilisateur',
    loadComponent: () => import('./gestion-utilisateur/gestion-utilisateur.component')
      .then(m => m.GestionUtilisateurComponent)
  },
  { path: '**', redirectTo: '/login' }, // Redirection pour les chemins inexistants

];
