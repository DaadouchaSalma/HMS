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
  }
]