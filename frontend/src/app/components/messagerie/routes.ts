import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';
import { roleGuard } from '../../role.guard';

export const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'msg',
        loadComponent: () => import('./messagerie/messagerie.component').then(m => m.MessagerieComponent),
        data: {
          title: 'Messagerie',
          
        }
      }
    ]
  }
];
