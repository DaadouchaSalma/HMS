import { Routes } from '@angular/router';

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
        data: {
          title: 'Ajout d\'une prescription'
        }
      }
    ]
  }
];
