import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rendez-Vous'
    },
    children: [
      {
        path: 'add-rdv',
        loadComponent: () => import('./add-rdv/add-rdv.component').then(m => m.AddRdvComponent),
        data: {
          title: 'Prendre Un Rendez-Vous',
          roles: ['Patient']
        }
      },
      {
        path: 'list-rdv',
        loadComponent: () => import('./annuler-rdv/annuler-rdv.component').then(m => m.AnnulerRdvComponent),
        data: {
          title: 'Ma liste Des Rendez-Vous',
          roles: ['Patient']
        }
      },
      
    ]
  }
];
