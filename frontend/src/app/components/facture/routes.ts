import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Facture'
    },
    children: [
      {
        path: '',
        redirectTo: 'historique',
        pathMatch: 'full'
      },
      {
        path: 'historique',
        loadComponent: () => import('./historique/historique.component').then(m => m.HistoriqueComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: ' ',
          roles: ['Patient']
        }
      },
      {
        path: 'historiquePayment',
        loadComponent: () => import('./all-admin/all-admin.component').then(m => m.AllAdminComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: ' ',
          roles: ['Admin']
        }
      }
      
    ]
  }
];