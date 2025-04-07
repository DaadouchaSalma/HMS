import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'meds',
    loadComponent: () => import('./medicaments/medicaments.component').then(m => m.MedicamentsComponent),
    data: {
      title: 'Les médicaments'
    }
  },
  {
    path: 'ajoutMed',
    loadComponent: () => import('./ajout-med/ajout-med.component').then(m => m.AjoutMedComponent),
    data: {
      title: 'Ajouter Des Médicaments'
    }
  },
  {
    path: 'ajoutF',
    loadComponent: () => import('./fournisseurs/ajout-fournisseur/ajout-fournisseur.component').then(m => m.AjoutFournisseurComponent),
    data: {
      title: 'Ajouter Des Fournisseurs'
    }
  },
  {
    path: 'fournisseurs',
    loadComponent: () => import('./fournisseurs/fournisseurs/fournisseurs.component').then(m => m.FournisseursComponent),
    data: {
      title: 'Consulter Les Fournisseurs'
    }
  },
  {
    path: 'ModifF/:id',
    loadComponent: () => import('./fournisseurs/update-fournisseur/update-fournisseur.component').then(m => m.UpdateFournisseurComponent),
    data: {
      title: 'Modifier Le Fournisseur'
    }
  },
  {
    path: 'categorie',
    loadComponent: () => import('./categorie/categorie.component').then(m => m.CategorieComponent),
    data: {
      title: 'Consulter Les Catégories'
    }
  },
  {
    path: 'medNotifs',
    loadComponent: () => import('./med-notifs/med-notifs.component').then(m => m.MedNotifsComponent),
    data: {
      title: 'Consulter Les Notifications'
    }
  },
  {
    path: 'paniers',
    loadComponent: () => import('./paniers-list/paniers-list.component').then(m => m.PaniersListComponent),
    data: {
      title: 'Consulter Les Paniers'
    }
  }
]