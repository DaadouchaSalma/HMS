import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dossier Médical '
    },
    children: [
      {
        path: '',
        redirectTo: 'dossierMListe/:id',
        pathMatch: 'full'
      },
      {
        path: 'dossierMListe',
        loadComponent: () => import('./dossier-list/dossier-list.component').then(m => m.DossierListComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: ' ',
          roles: ['Patient']
        }
      } ,
      {
        path: 'dossierMListeMedecin/:id',
        loadComponent: () => import('./dossier-list-medecin/dossier-list-medecin.component').then(m => m.DossierListMedecinComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: ' ',
          roles: ['Medecin','PersonnelAdministratif']
        }
      } 
      
    ]
  }
];


