import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';
import { roleGuard } from '../../role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard, roleGuard],
    data: {
      title: 'chat',
      roles: ['Patient']
    },
  }
];
