//user.types.ts

/* permet de definir la structure d'un utilisateur (si on a besoin 
    d'ajouter ou modifier un champ on le fait directement ici )*/

/** 
 * Représente un utilisateur du système
 * @property id - Identifiant unique de l'utilisateur
 * @property statut - Détermine les droits d'accès de l'utilisateur
 */

export interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    photo: any;
    statut: 'Admin' | 'User';
    actif: boolean; // Indique si l'utilisateur est actif   role : 'Admin' | 'User';
    dateCreation: Date;      // Date de création
    dateModification: Date;  // Date de modification
  }
  
  //definir les types de message (supprimer, modifier, ajouter)

  export interface DialogData {
    title: string;
    message: string;
    type: 'delete' | 'warning' | 'primary';
  }