import { Routes } from '@angular/router';

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
        data: {
          title: 'Ajout d\'un DME'
        }
      },
      {
        path: 'update',
        loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
        data: {
          title: 'Mise à jour d\'un DME'
        }
      }
    ]
  }
];
