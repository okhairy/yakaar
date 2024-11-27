import { Routes } from '@angular/router';
import { LoginComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/login/login.component';
//import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/components/dashboard/dashboard.component';

import { CodeSecretComponent } from '/home/oumoul-khairy/Documents/yakaar (2)/src/app/auth/code-secret/code-secret.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: 'login', component: LoginComponent },
  { path: 'auth/code-secret', component: CodeSecretComponent },
 // { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'dashboard-client', component: DashboardComponent },

  { path: '**', redirectTo: '/login' }, // Redirection pour les chemins inexistants

];
