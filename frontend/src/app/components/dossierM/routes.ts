import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'dossierM'
    },
    children: [
      {
        path: '',
        redirectTo: 'dossierMListe/:id',
        pathMatch: 'full'
      },
      {
        path: 'dossierMListe/:id',
        loadComponent: () => import('./dossier-list/dossier-list.component').then(m => m.DossierListComponent),
        data: {
          title: ' '
        }
      } ,
      {
        path: 'dossierMListeMedecin/:id',
        loadComponent: () => import('./dossier-list-medecin/dossier-list-medecin.component').then(m => m.DossierListMedecinComponent),
        data: {
          title: ' '
        }
      } 
      
    ]
  }
];


