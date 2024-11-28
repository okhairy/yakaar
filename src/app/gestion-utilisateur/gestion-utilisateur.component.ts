import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  //status?: boolean;
  motDePasse:String;
  codeSecret:Number;
  telephone:Number;
  sexe: 'm' | 'f'
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
totalUsers = 0;  
filteredUsers: User[] = []; // Liste filtrée à afficher dans la table
// Nouveau contrôle de recherche réactif
searchControl = new FormControl('');
  

showAddForm = false;
editingUser: User | null = null;
showConfirmModal = false;
userToDelete: User | null = null;


currentUserId = ''; // À définir avec l'ID de l'utilisateur connecté
displayedColumns = ['prenom', 'nom', 'email', 'role', 'actions'];
userForm: FormGroup;
  searchTerm: any;

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
    ], // Préfixe valide suivi de 7 chiffres
    sexe: ['', [Validators.required]],
    role: ['simple', Validators.required]  // 'simple' est la valeur par défaut
  });


    // Initialiser la liste filtrée avec tous les utilisateurs
    this.filteredUsers = [...this.users];

}



openModal(): void {
  this.showAddForm = true;
}

closeModal(): void {
  this.showAddForm = false;
  this.cancelEdit();
}






ngOnInit() {
  
  this.loadUsers();




   // Configuration de la recherche réactive
   this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  ).subscribe(searchTerm => {
    this.performSearch('searchTerm');
  });
}

// Nouvelle méthode de recherche optimisée
performSearch(searchTerm: string): void {
  const term = (searchTerm || '').toLowerCase().trim();

  if (!term) {
    this.filteredUsers = [...this.users];
    this.totalUsers = this.users.length;
    return;
  }

  this.filteredUsers = this.users.filter(user => 
    user.nom.toLowerCase().includes(term) ||
    user.prenom.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.role.toLowerCase().includes(term)
  );

  this.totalUsers = this.filteredUsers.length;
}




loadUsers(): void {
  this.apiService.getUsers().subscribe({
    next: (response) => {
      this.users = response; // Charge la liste complète des utilisateurs
      this.filteredUsers = [...this.users]; // Met à jour la liste filtrée
      this.totalUsers = this.users.length; // Total des utilisateurs
    },
    error: () => {
      this.showNotification('Erreur lors du chargement des utilisateurs', 'error');
    }
  });
}




 // Fonction appelée à chaque saisie
 onSearch(): void {
  const term = this.searchTerm.toLowerCase().trim();

  // Si le terme est vide, réafficher tous les utilisateurs
  if (!term) {
    this.filteredUsers = [...this.users];
    return;
  }

  // Filtrage avancé avec plusieurs critères
  this.filteredUsers = this.users.filter(user => 
    user.nom.toLowerCase().includes(term) ||
    user.prenom.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.role.toLowerCase().includes(term)
  );
}



 // Méthode pour ouvrir la modal avec l'utilisateur à éditer
 openEditModal(user: User): void {
  this.editingUser = user;
  this.userForm.patchValue(user); // Pré-remplir le formulaire avec les données de l'utilisateur
}

// Méthode pour annuler l'édition
cancelEdit(): void {
  this.editingUser = null;
  this.userForm.reset();
}

saveChanges(): void {
  if (this.userForm.valid) {
    // Créez un objet avec les valeurs du formulaire et l'ID de l'utilisateur que vous éditez
    const updatedUser = { 
      ...this.userForm.value, 
      id: this.editingUser?._id // Assurez-vous que l'ID de l'utilisateur est présent ici
    };

    // Envoi de la requête PUT à l'API
    this.apiService.updateUser(updatedUser.id, updatedUser).subscribe({
      next: (response) => {
        // Si la mise à jour est réussie
        this.showNotification('Utilisateur modifié avec succès', 'success');
        this.loadUsers(); // Recharge la liste des utilisateurs
        this.cancelEdit(); // Fermer la modal après la mise à jour
      },
      error: (err) => {
        // Vérification et affichage du message d'erreur envoyé par l'API
        const errorMessage = err.error?.message || 'Erreur lors de la modification';
        this.showNotification(errorMessage, 'error'); // Affiche l'erreur
        console.error('Erreur capturée:', err); // Log l'erreur pour débogage
      }
    });
  } else {
    // Si le formulaire est invalide
    this.showNotification('Veuillez remplir correctement le formulaire.', 'warning');
  }
}



onSubmit(): void {
  if (this.userForm.valid) {
    const userData = this.userForm.value;

    // Appel au service pour créer un nouvel utilisateur
    this.apiService.createUser(userData).subscribe({
      next: () => {
        this.showNotification('Utilisateur ajouté avec succès', 'success');
        this.loadUsers(); // Recharge la liste des utilisateurs
        this.closeModal(); // Ferme la modal
      },
      error: () => {
        this.showNotification('Erreur lors de l\'ajout de l\'utilisateur', 'error');
      }
    });
  } else {
    this.showNotification('Veuillez remplir tous les champs requis.', 'error');
  }
}

//methode pour supprimer un user
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
 // Méthode pour basculer le rôle de l'utilisateur
  toggleUserRole(user: User) {
    // Si l'utilisateur n'a pas d'_id, on ne fait rien
    if (!user._id) return;

    // Change le rôle en fonction de l'état actuel (Admin -> User et vice versa)
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';

    // Appelez votre service pour mettre à jour le rôle de l'utilisateur
    this.apiService.toggleUserRole(user._id, newRole).subscribe({
      next: () => {
        // Recharge les utilisateurs et affiche une notification de succès
        this.loadUsers();
        this.showNotification('Rôle modifié avec succès', 'success');
      },
      error: () => {
        // Affiche une notification d'erreur en cas de problème
        this.showNotification('Erreur lors du changement de rôle', 'error');
      }
    });
  }

/*updateUserStatus(user: User) {
  if (user._id && user.status !== undefined) {
    this.apiService.updateUserStatus(user._id, !user.status).subscribe({
      next: (response) => {
        user.status = !user.status;

        this.loadUsers();
        this.showNotification( `Utilisateur ${user.prenom} ${user.nom} ${user.status ? 'activé' : 'désactivé'}`, 
          'success');
      },
      error: () => {
        this.showNotification('Erreur lors du changement de statut', 'error');
      }
    });
  }
}*/

onPageChange(event: PageEvent) {
      // MatPaginator renvoie un index commençant à 0, donc on ajoute 1

  this.currentPage = event.pageIndex + 1;
  this.itemsPerPage = event.pageSize;
  this.loadUsers();
}

showNotification(message: string, type: 'error' | 'success' | 'warning'): void {
  const snackBarClass =
    type === 'success' ? 'snackbar-success' :
    type === 'error' ? 'snackbar-error' :
    'snackbar-warning'; // Classe pour les avertissements

  this.snackBar.open(message, 'Fermer', {
    duration: 3000,
    panelClass: [snackBarClass],
  });
}

}