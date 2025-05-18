import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';


export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Chambre'
    },
    children: [
      {
        path: '',
        redirectTo: 'chambreAdd',
        pathMatch: 'full'
      },
      {
        path: 'chambreAdd',
        loadComponent: () => import('./chambre-add/chambre-add.component').then(m => m.ChambreAddComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajouter Une Chambre',
          roles: ['PersonnelAdministrative','Admin']
        }
      },
      {
        path: 'chambreList',
        loadComponent: () => import('./chambre-list/chambre-list.component').then(m => m.ChambreListComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'La Liste des chambres',
          roles: ['PersonnelAdministrative','Admin']
        }
      },
      {
        path: 'chambreEdit/:id',
        loadComponent: () => import('./chambre-edit/chambre-edit.component').then(m => m.ChambreEditComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Modifier une chambre',
          roles: ['PersonnelAdministrative','Admin']
        }
      }
      
    ]
  }
];


