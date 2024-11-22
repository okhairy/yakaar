import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../services/api.service.js'; 



//routes
import { RouterModule } from '@angular/router';


// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt, faSignOutAlt, faSearch, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

// Composants partagés
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-gestion-utilisateur',
  standalone: true, 


  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    SidebarComponent
    
  ],
  templateUrl: './gestion-utilisateur.component.html',
  styleUrls: ['./gestion-utilisateur.component.css']
})
export class GestionUtilisateurComponent  implements OnInit{
  // FontAwesome icons
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faSignOutAlt = faSignOutAlt;
  faSearch = faSearch;
  faExchangeAlt = faExchangeAlt;




  searchTerm: string = ''; // Recherche utilisateur
  itemsPerPage: number = 10; // Nombre d'éléments par page
  currentPage: number = 1; // Page actuelle

  // Ces données sont à récupérer via une API ou un service
  users: any[] = []; //Liste des utilisateurs

  // Colonnes affichées dans le tableau
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'role', 'actions'];


  constructor(private apiService: ApiService) {}


  ngOnInit(): void {
    this.getUsers();
  }


  // Récupérer les utilisateurs depuis l'API
  getUsers(): void {
    this.apiService.getAllUsers().subscribe(
      (data) => {
        this.users = data; // Assurez-vous que la réponse contient la liste des utilisateurs
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }


  /**
   * Récupère la liste des utilisateurs filtrés par recherche.
   */
  get filteredUsers() {
    return this.users.filter(user =>
      `${user.nom} ${user.prenom} ${user.email}`.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Renvoie les utilisateurs pour la page actuelle.
   */
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /**
   * Supprime un utilisateur en fonction de son ID.
   * @param userId ID de l'utilisateur à supprimer.
   */
  deleteUser(userId: string) {
    this.apiService.deleteUser(userId).subscribe(
      () => {
        this.getUsers(); // Recharger les utilisateurs après la suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      }
    );
  }

  /**
   * Alterne le rôle d'un utilisateur entre "Admin" et "User".
   * @param user Objet utilisateur.
   */
  toggleUserRole(user: any) {
    user.role = user.role === 'Admin' ? 'User' : 'Admin';
    this.apiService.updateUser(user.id, user).subscribe(
      () => {
        console.log(`Rôle changé pour l'utilisateur: ${user.id} -> ${user.role}`);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle', error);
      }
    );
  }
}

