import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CodeSecretComponent } from './auth/code-secret/code-secret.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'login', component: LoginComponent },
  { path: 'auth/code-secret', component: CodeSecretComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: '**', redirectTo: '/login' }, // Redirection pour les chemins inexistants

];
