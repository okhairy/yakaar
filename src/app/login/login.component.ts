import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { WebSocketService } from '../services/websocket.service'; // Importer le WebSocketService
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  private webSocketSubscription?: Subscription; // Gestion de l'abonnement WebSocket

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private webSocketService: WebSocketService // Injection du WebSocketService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Écoute des événements WebSocket
    this.webSocketSubscription = this.webSocketService
      .listen('code-secret') // Événement émis par le Keypad
      .subscribe((key: string) => {
        console.log('Touche reçue sur login :', key);
        this.navigateToCodeSecret();
      });
  }

  onSubmit(): void {
    this.errorMessage = '';

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
          }
        },
        (error: Error) => {
          this.errorMessage = error.message || 'Une erreur inattendue est survenue. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearEmailErrors(): void {
    if (this.loginForm.get('email')?.touched && this.loginForm.get('email')?.valid) {
      this.loginForm.get('email')?.setErrors(null);
    }
  }

  clearPasswordErrors(): void {
    if (this.loginForm.get('password')?.touched && this.loginForm.get('password')?.valid) {
      this.loginForm.get('password')?.setErrors(null);
    }
  }

  private navigateToCodeSecret(): void {
    console.log('Redirection vers Code Secret...');
    this.router.navigate(['/code-secret']);
  }

  ngOnDestroy(): void {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe(); // Désabonnement pour éviter les fuites
    }
  }
}
