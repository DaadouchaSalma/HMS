import { Routes } from '@angular/router';

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
        data: {
          title: 'Ajouter Une Chambre'
        }
      },
      {
        path: 'chambreList',
        loadComponent: () => import('./chambre-list/chambre-list.component').then(m => m.ChambreListComponent),
        data: {
          title: 'La Liste des chambres'
        }
      },
      {
        path: 'chambreEdit/:id',
        loadComponent: () => import('./chambre-edit/chambre-edit.component').then(m => m.ChambreEditComponent),
        data: {
          title: 'Modifier une chambre'
        }
      }
      
    ]
  }
];


