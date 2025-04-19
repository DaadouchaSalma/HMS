import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';
import { roleGuard } from '../../role.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'DME'
    },
    children: [
      {
        path: 'new',
        loadComponent: () => import('./add/add.component').then(m => m.AddComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout d\'un DME',
          roles: ['Medecin','PersonnelAdministratif']
        }
      },
      {
        path: 'update',
        loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout de données cliniques',
          roles: ['Medecin','PersonnelAdministratif']
        }
      }
    ]
  }
];
