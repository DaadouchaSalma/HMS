import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';
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
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajouter Une Reclamation',
          roles: ['Patient']
        }
      },
      {
        path: 'reclamationList',
        loadComponent: () => import('./reclamation-list/reclamation-list.component').then(m => m.ReclamationListComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'La Liste des reclamations',
          roles: ['PersonnelAdministratif']
        }
      } 
    ]
  }
];


