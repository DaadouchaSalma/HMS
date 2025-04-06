import { Routes } from '@angular/router';

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
        data: {
          title: 'Ajout d\'un Patient'
        }
      },
      {
        path: 'update',
        loadComponent: () => import('./update-patient/update-patient.component').then(m => m.UpdatePatientComponent),
        data: {
          title: 'Mise à jour d\'un Patient'
        }
      },
      {
        path: 'list',
        loadComponent: () => import('./list-patient/list-patient.component').then(m => m.ListPatientComponent),
        data: {
          title: 'Liste des Patients'
        }
      }
    ]
  }
];
