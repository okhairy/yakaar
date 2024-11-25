import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
//import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { GestionUtilisateurComponent } from './gestion-utilisateur/gestion-utilisateur.component';



@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'pin-login';
}
