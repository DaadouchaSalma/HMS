import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard'
import { roleGuard } from '../../role.guard'

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Patients'
    },
    children: [
      {
        path: 'new',
        loadComponent: () => import('./add-patient/add-patient.component').then(m => m.AddPatientComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout d\'un Patient',
          roles: ['Medecin', 'PersonnelAdministrative']
        }
      },
      {
        path: 'update',
        loadComponent: () => import('./update-patient/update-patient.component').then(m => m.UpdatePatientComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Mise à jour d\'un Patient',
          roles: ['Patient']
        }
      },
      {
        path: 'list',
        loadComponent: () => import('./list-patient/list-patient.component').then(m => m.ListPatientComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Liste des Patients',
          roles: ['Medecin', 'PersonnelAdministrative', 'Admin']
        }
      }
    ]
  }
];
