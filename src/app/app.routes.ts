import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/components/dashboard/dashboard.component';
import { CodeSecretComponent } from './code-secret/code-secret.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'code-secret', component: CodeSecretComponent },

  { path: '**', redirectTo: '/login' }, // Redirection pour les chemins inexistants

];
