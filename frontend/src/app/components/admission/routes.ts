import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';

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
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajouter Une Admission ',
          roles: ['PersonnelAdministrative']
        }
      } ,
      {
        path: 'admissionList',
        loadComponent: () => import('./admission-list/admission-list.component').then(m => m.AdmissionListComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Admissions Actuelles ',
          roles: ['PersonnelAdministrative']
        }
      } 
    ]
  }
];


