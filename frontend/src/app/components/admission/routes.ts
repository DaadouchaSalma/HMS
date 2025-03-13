import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'admission'
    },
    children: [
      {
        path: '',
        redirectTo: 'admissionAdd',
        pathMatch: 'full'
      },
      {
        path: 'admissionAdd',
        loadComponent: () => import('./admission-add/admission-add.component').then(m => m.AdmissionAddComponent),
        data: {
          title: 'Ajouter Une Admission '
        }
      } ,
      {
        path: 'admissionList',
        loadComponent: () => import('./admission-list/admission-list.component').then(m => m.AdmissionListComponent),
        data: {
          title: 'Admissions Actuelles '
        }
      } 
    ]
  }
];


