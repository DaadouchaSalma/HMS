import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Messagerie'
    },
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
