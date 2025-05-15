import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';
import { roleGuard } from '../../role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-medecin.component').then(m => m.DashboardMedecinComponent),
    canActivate: [authGuard, roleGuard],
    data: {
      title: 'Tableau de bord',
      roles: ['Medecin']
    },
  }
];
