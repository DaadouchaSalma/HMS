import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Patients List'
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
        path: 'update/:id',
        loadComponent: () => import('./update-patient/update-patient.component').then(m => m.UpdatePatientComponent),
        data: {
          title: 'Mise à jour d\'un Patient'
        }
      }
    ]
  }
];
