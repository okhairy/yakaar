import { bootstrapApplication } from '@angular/platform-browser';
import { DashboardComponent } from './app/dashboard/dashboard.component';

bootstrapApplication(DashboardComponent)
  .catch(err => console.error(err));
