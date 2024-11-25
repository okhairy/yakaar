import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup; // Déclaration de loginForm
  errorMessage: string = ''; // Message d'erreur

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private fb: FormBuilder // Ajout du FormBuilder
  ) {
    // Initialisation de loginForm avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.errorMessage = ''; // Réinitialiser le message d'erreur avant la soumission
  
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.apiService.authenticateUser(email, password).subscribe(
        (response: any) => {
          // Gestion du succès
          if (response.token && response.user?.role) {
            localStorage.setItem('token', response.token);
  
            if (response.user.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (response.user.role === 'simple') {
              this.router.navigate(['/user-dashboard']);
            }
          }
        },
        (error: Error) => {
          // Affichage de l'erreur reçue
          this.errorMessage = error.message || 'Une erreur inattendue est survenue. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
