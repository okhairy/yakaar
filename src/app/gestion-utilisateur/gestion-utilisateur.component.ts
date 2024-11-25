import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../services/api.service';
import { SidebarComponent } from '../sidebar/sidebar.component';





interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'Admin' | 'User';
  status?: boolean;
}


@Component({
  selector: 'app-gestion-utilisateur',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSelectModule,
    SidebarComponent
  ],
  providers: [ApiService],

  templateUrl: './gestion-utilisateur.component.html',
  styleUrl: './gestion-utilisateur.component.css'
})
export class GestionUtilisateurComponent {






users: User[] = [];
currentPage = 1;
itemsPerPage = 8;
searchTerm = '';
totalUsers = 0;
showAddForm = false;
editingUser: User | null = null;
currentUserId = ''; // À définir avec l'ID de l'utilisateur connecté
displayedColumns = ['prenom', 'nom', 'email', 'role', 'status', 'actions'];
userForm: FormGroup;

constructor(
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  private apiService: ApiService
) {
  this.userForm = this.fb.group({
       prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]]
    });
}


openModal(): void {
  this.showAddForm = true;
}

closeModal(): void {
  this.showAddForm = false;
}






ngOnInit() {
  this.loadUsers();
}

loadUsers() {
  if (this.searchTerm) {
    this.searchUsers();
  } else {
    this.apiService.getUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.total;
      },
      error: () => {
        this.showNotification('Erreur lors du chargement des utilisateurs', 'error');
      }
    });
  }
}

onSearch() {
  if (this.searchTerm.length >= 3 || this.searchTerm.length === 0) {
    this.loadUsers();
  }
}

searchUsers() {
  this.apiService.searchUsers(this.searchTerm).subscribe({
    next: (response) => {
      this.users = response.users;
      this.totalUsers = response.total;
    },
    error: () => {
      this.showNotification('Erreur lors de la recherche', 'error');
    }
  });
}

startEdit(user: User) {
  this.editingUser = user;
  this.userForm.patchValue(user);
  this.showAddForm = false;
}

cancelEdit() {
  this.editingUser = null;
  this.showAddForm = false;
  this.userForm.reset({ role: 'User' });
}

onSubmit(): void {
  if (this.userForm.valid) {
    const userData = this.userForm.value;

    // Si on est en mode édition
    if (this.editingUser && this.editingUser._id) {
      this.apiService.updateUser(this.editingUser._id, userData).subscribe({
        next: () => {
          this.showNotification('Utilisateur modifié avec succès', 'success');
          this.loadUsers(); // Recharge la liste des utilisateurs
          this.closeModal(); // Ferme la modal
        },
        error: () => {
          this.showNotification('Erreur lors de la modification', 'error');
        }
      });
    } 
    // Si on est en mode ajout
    else {
      this.apiService.createUser(userData).subscribe({
        next: () => {
          this.showNotification('Utilisateur ajouté avec succès', 'success');
          this.loadUsers(); // Recharge la liste des utilisateurs
          this.closeModal(); // Ferme la modal
        },
        error: () => {
          this.showNotification('Erreur lors de l\'ajout', 'error');
        }
      });
    }
  } else {
    this.showNotification('Veuillez remplir tous les champs requis.', 'error');
  }
}


deleteUser(user: User) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom}?`)) {
    if (user._id) {
      this.apiService.deleteUser(user._id).subscribe({
        next: () => {
          this.showNotification('Utilisateur supprimé avec succès', 'success');
          this.loadUsers();
        },
        error: () => {
          this.showNotification('Erreur lors de la suppression', 'error');
        }
      });
    }
  }
}

toggleUserRole(user: User) {
  if (user._id) {
    this.apiService.toggleUserRole(user._id).subscribe({
      next: () => {
        this.loadUsers();
        this.showNotification('Rôle modifié avec succès', 'success');
      },
      error: () => {
        this.showNotification('Erreur lors du changement de rôle', 'error');
      }
    });
  }
}

updateUserStatus(user: User) {
  if (user._id && user.status !== undefined) {
    this.apiService.updateUserStatus(user._id, user.status).subscribe({
      next: () => {
        this.loadUsers();
        this.showNotification('Statut modifié avec succès', 'success');
      },
      error: () => {
        this.showNotification('Erreur lors du changement de statut', 'error');
      }
    });
  }
}

onPageChange(event: any) {
  this.currentPage = event.pageIndex + 1;
  this.itemsPerPage = event.pageSize;
  this.loadUsers();
}

showNotification(message: string, type: 'success' | 'error') {
  this.snackBar.open(message, 'Fermer', {
    duration: 3000,
    panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
  });
}
}