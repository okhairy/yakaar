import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { PageEvent } from '@angular/material/paginator';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'Admin' | 'User';
  motDePasse: string;
  codeSecret: number;
  telephone: number;
  sexe: 'Homme' | 'Femme';
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
export class GestionUtilisateurComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalUsers = 0;  
  filteredUsers: User[] = [];
  
  searchControl = new FormControl('');
  showPassword = false;

  showAddForm = false;
  editingUser: User | null = null;
  showConfirmModal = false;
  userToDelete: User | null = null;

  currentUserId = ''; 
  displayedColumns = ['prenom', 'nom', 'email', 'role', 'actions'];
  userForm: FormGroup;
  


  // Méthode pour basculer la visibilité du mot de passe
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.userForm = this.fb.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      codeSecret: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      telephone: [
        '',
        [Validators.required, Validators.pattern(/^(70|75|76|77|78)\d{7}$/)]
      ],
      sexe: ['', [Validators.required]],
      role: ['simple', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();

    // Configuration de la recherche réactive
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche

      this.performSearch();
    });
  }



  performSearch(): void {
    const term = this.searchControl.value?.toLowerCase().trim() || '';
  
    if (!term) {
      // Si aucun terme de recherche, recharger tous les utilisateurs
      this.filteredUsers = this.users.slice(
        (this.currentPage - 1) * this.itemsPerPage, 
        this.currentPage * this.itemsPerPage
      );
      this.totalUsers = this.users.length;
      return;
    }
  
    // Filtrage côté client avec plusieurs critères de recherche
    const searchResults = this.users.filter(user => 
      user.nom.toLowerCase().startsWith(term) ||
      user.prenom.toLowerCase().startsWith(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  
    // Mettre à jour le nombre total d'utilisateurs filtrés
    this.totalUsers = searchResults.length;
  
    // Pagination sur les résultats de recherche
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = searchResults.slice(startIndex, endIndex);
  
    // Afficher un message si aucun résultat n'est trouvé
    if (this.filteredUsers.length === 0) {
      this.showNotification('Aucun utilisateur trouvé', 'warning');
    }
  }



  loadUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    this.apiService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = this.users.slice(startIndex, endIndex);
        this.totalUsers = this.users.length;
      },
      error: () => {
        this.showNotification('Erreur lors du chargement des utilisateurs', 'error');
      }
    });
  }

  openModal(): void {
    this.showAddForm = true;
  }

  closeModal(): void {
    this.showAddForm = false;
    this.cancelEdit();
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset();
  }

  saveChanges(): void {
    if (this.userForm.valid) {
      const updatedUser = { 
        ...this.userForm.value, 
        id: this.editingUser?._id
      };

      this.apiService.updateUser(updatedUser.id, updatedUser).subscribe({
        next: () => {
          this.showNotification('Utilisateur modifié avec succès', 'success');
          this.loadUsers();
          this.cancelEdit();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Cet identifiant est déjà utilisé';
          this.showNotification(errorMessage, 'error');
          console.error('Erreur capturée:', err);
        }
      });
    } else {
      this.showNotification('Veuillez remplir correctement le formulaire.', 'warning');
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      this.apiService.createUser(userData).subscribe({
        next: () => {
          this.showNotification('Utilisateur ajouté avec succès', 'success');
          this.loadUsers();
          this.closeModal();
        },
        error: () => {
          this.showNotification('Cet identifiant est déjà utilisé', 'error');
        }
      });
    } else {
      this.showNotification('Veuillez remplir tous les champs requis.', 'error');
    }
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.userToDelete = null;
  }

  confirmDelete() {
    if (this.userToDelete && this.userToDelete._id) {
      this.apiService.deleteUser(this.userToDelete._id).subscribe({
        next: () => {
          this.showNotification('Utilisateur supprimé avec succès', 'success');
          this.loadUsers();
          this.showConfirmModal = false;
          this.userToDelete = null;
        },
        error: () => {
          this.showNotification('Erreur lors de la suppression', 'error');
          this.showConfirmModal = false;
        }
      });
    }
  }

  toggleUserRole(user: User) {
    if (!user._id) return;

    const newRole = user.role === 'Admin' ? 'User' : 'Admin';

    this.apiService.toggleUserRole(user._id, newRole).subscribe({
      next: () => {
        this.loadUsers();
        this.showNotification('Rôle modifié avec succès', 'success');
      },
      error: () => {
        this.showNotification('Erreur lors du changement de rôle', 'error');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadUsers();
  }

  showNotification(message: string, type: 'error' | 'success' | 'warning'): void {
    const snackBarClass =
      type === 'success' ? 'snackbar-success' :
      type === 'error' ? 'snackbar-error' :
      'snackbar-warning';

    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [snackBarClass],
    });
  }
}