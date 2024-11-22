import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
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
          if (response.token && response.user?.role) {
            localStorage.setItem('token', response.token);
            if (response.user.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (response.user.role === 'simple') {
              this.router.navigate(['/user-dashboard']);
            }
          } else {
            this.errorMessage = 'Données de rôle manquantes dans la réponse.';
          }
        },
        (error) => {
          // Gérer les erreurs spécifiques
          if (error.error.errorType === 'email') {
            this.errorMessage = error.error.errorMessage; // Erreur email
          } else if (error.error.errorType === 'password') {
            this.errorMessage = error.error.errorMessage; // Erreur mot de passe
          } else {
            this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          }
        }
      );
    }
  }
  

  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}