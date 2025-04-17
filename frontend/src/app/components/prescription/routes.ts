import { Routes } from '@angular/router';

import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';



export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Prescriptions'
    },
    children: [
      {
        path: 'new',
        loadComponent: () => import('./add-prescription/add-prescription.component').then(m => m.AddPrescriptionComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout d\'une prescription',
          roles: ['Patient']
        }
      },
      {
        path: 'listPrescription',
        loadComponent: () => import('./list-prescription/list-prescription.component').then(m => m.ListPrescriptionComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Liste des prescriptions',
          roles: ['Patient']
        }
      }

    ]
  }
];
