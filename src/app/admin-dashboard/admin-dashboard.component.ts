import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object  // Injecte PLATFORM_ID
  ) {}

  ngOnInit(): void {
    // Vérifier si l'application est en mode client
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
}
