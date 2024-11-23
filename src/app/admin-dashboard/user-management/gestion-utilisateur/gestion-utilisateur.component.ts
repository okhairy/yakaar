import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { User } from '../user.types';
import { ApiService } from '../../../services/api.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';  // Importer ToastrModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Nécessaire pour les animations des Toastr
import { MatDialog, MatDialogRef } from '@angular/material/dialog';import { SidebarComponent } from '../../../sidebar/sidebar.component';

@Component({
  selector: 'app-gestion-utilisateur',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,  // Importer BrowserAnimationsModule
    ToastrModule.forRoot()  // Ajouter le ToastrModule avec la configuration par défaut
  ],
  templateUrl: './gestion-utilisateur.component.html',
  styleUrls: ['./gestion-utilisateur.component.css']
})
export class GestionUtilisateurComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;
  searchQuery = '';
  isLoading = false;
  totalUsers = 0;

  // Pour le tri
  sortField: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Chargement des utilisateurs avec pagination
  loadUsers() {
    this.isLoading = true;
    this.apiService.getUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalUsers = response.total;
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des utilisateurs');
        this.isLoading = false;
      }
    });
  }

  // Navigation dans les pages
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  // Recherche d'utilisateurs
  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchQuery = searchValue;
    
    if (this.searchQuery.length > 2) {
      this.isLoading = true;
      this.apiService.searchUsers(this.searchQuery).subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalUsers = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la recherche');
          this.isLoading = false;
        }
      });
    } else if (this.searchQuery.length === 0) {
      this.loadUsers();
    }
  }

  // Gestion du statut utilisateur (actif/inactif)
  toggleUserStatus(user: User) {
    const newStatut = !user.actif;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmer le changement de statut',
        message: `Êtes-vous sûr de vouloir ${newStatut ? 'activer' : 'désactiver'} l'utilisateur ${user.prenom} ${user.nom} ?`,
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {      if (confirmed) {
        this.apiService.updateUserStatus(user.id, newStatut).subscribe({
          next: () => {
            user.actif = newStatut;
            this.toastr.success(`Utilisateur ${newStatut ? 'activé' : 'désactivé'} avec succès`);
          },
          error: () => this.toastr.error('Erreur lors du changement de statut')
        });
      }
    });
  }

  // Ouvrir le formulaire pour ajouter ou modifier un utilisateur
  openUserForm(user?: User) {
  const dialogRef: MatDialogRef<UserFormComponent, User | undefined> = this.dialog.open(UserFormComponent, { 
         data: user,  // Passer l'utilisateur actuel si c'est une modification
      width: '400px',  // Dimension du dialog
    });

    // Gérer la fermeture du dialog et la logique après la soumission du formulaire
    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        if (user) {
          // Si un utilisateur est passé, il s'agit d'une modification
          this.updateUser(user, result);
        } else {
          // Sinon, c'est un ajout d'un nouvel utilisateur
          this.addUser(result);
        }
      }
    });
  }

  // Ajouter un utilisateur
  addUser(user: User) {
    this.isLoading = true;
    this.apiService.createUser(user).subscribe({
      next: (response) => {
        this.users.push(response);  // Ajouter l'utilisateur à la liste
        this.toastr.success('Utilisateur ajouté avec succès');
        this.loadUsers();  // Recharger la liste après ajout
      },
      error: () => {
        this.toastr.error('Erreur lors de l\'ajout de l\'utilisateur');
        this.isLoading = false;
      }
    });
  }

  // Mettre à jour un utilisateur
  updateUser(user: User, updatedData: User) {
    this.isLoading = true;
    this.apiService.updateUser(user.id, updatedData).subscribe({
      next: () => {
        // Mettre à jour l'utilisateur dans la liste
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...updatedData };
        }
        this.toastr.success('Utilisateur mis à jour avec succès');
      },
      error: () => {
        this.toastr.error('Erreur lors de la mise à jour de l\'utilisateur');
        this.isLoading = false;
      }
    });
  }


// Ajoute la méthode dans ton composant
confirmDelete(user: User) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom} ?`,
      type: 'danger'
    }
  });

  // Action après confirmation
  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.deleteUser(user);
    }
  });
}

// Méthode pour supprimer l'utilisateur
deleteUser(user: User) {
  this.apiService.deleteUser(user.id).subscribe({
    next: () => {
      this.toastr.success(`Utilisateur ${user.prenom} ${user.nom} supprimé avec succès`);
      this.loadUsers(); // Recharge la liste des utilisateurs
    },
    error: () => {
      this.toastr.error('Erreur lors de la suppression de l\'utilisateur');
    }
  });
}


  // Génération des numéros de page pour la pagination
  get pages(): number[] {
    const visiblePages = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

   // Propriété qui calcule et renvoie l'info de pagination
   get currentPageInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalUsers);
    return `${start} à ${end} sur ${this.totalUsers} utilisateurs`;
  }
}



