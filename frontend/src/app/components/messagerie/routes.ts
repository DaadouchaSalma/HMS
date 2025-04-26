import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'msg',
        loadComponent: () => import('./messagerie/messagerie.component').then(m => m.MessagerieComponent),
        data: {
          title: 'Messagerie'
        }
      }
    ]
  }
];
