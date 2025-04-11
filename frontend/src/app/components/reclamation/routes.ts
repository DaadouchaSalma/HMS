import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reclamation'
    },
    children: [
      {
        path: '',
        redirectTo: 'reclamationAdd',
        pathMatch: 'full'
      },
      {
        path: 'reclamationAdd',
        loadComponent: () => import('./reclamation-add/reclamation-add.component').then(m => m.ReclamationAddComponent),
        data: {
          title: 'Ajouter Une Reclamation'
        }
      },
      {
        path: 'reclamationList',
        loadComponent: () => import('./reclamation-list/reclamation-list.component').then(m => m.ReclamationListComponent),
        data: {
          title: 'La Liste des reclamations'
        }
      } 
    ]
  }
];


