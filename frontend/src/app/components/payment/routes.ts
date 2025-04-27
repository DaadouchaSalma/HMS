import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard'
import { roleGuard } from '../../role.guard'

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Payment'
    },
    children: [
      {
        path: 'new',
        loadComponent: () => import('./payment.component').then(m => m.PaymentComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: '',
          roles: ['Patient']
        }
      }
    ]
  }
];
