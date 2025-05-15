import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';
import { roleGuard } from '../../role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-admin.component').then(m => m.DashboardAdminComponent),
    canActivate: [authGuard, roleGuard],
    data: {
      title: 'Dashboard',
      roles: ['Admin']
    },
  }
];
