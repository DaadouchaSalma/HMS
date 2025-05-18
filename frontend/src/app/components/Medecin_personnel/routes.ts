import { Routes } from '@angular/router';
import { roleGuard } from '../../role.guard';
import { authGuard } from '../../auth.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Personnels'
    },
    children: [
      {
        path: 'add-pharmacien',
        loadComponent: () => import('./add-pharmacien/add-pharmacien.component').then(m => m.AddPharmacienComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout Du Pharmacien',
          roles: ['Admin']
        }
      },
      {
        path: 'add-personnel-admin',
        loadComponent: () => import('./add-personnel-admin/add-personnel-admin.component').then(m => m.AddPersonnelAdminComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout Du Personnel Administrative',
          roles: ['Admin']
        }
      },
      {
        path: 'add-medecin',
        loadComponent: () => import('./medecin-ajout/medecin-ajout.component').then(m => m.MedecinAjoutComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Ajout Du Medecin',
          roles: ['Admin']
        }
      },
      {
        path: 'list-personnel',
        loadComponent: () => import('./personnel-list/personnel-list.component').then(m => m.PersonnelListComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Liste Des personnels',
          roles: ['Admin']
        }
      },
      {
        path: 'edit-medecin',
        loadComponent: () => import('./edit-medecin/edit-medecin.component').then(m => m.EditMedecinComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Mon Profil',
          roles: ['Medecin']
        }
      },
      {
        path: 'edit-pharmacien',
        loadComponent: () => import('./edit-pharmacien/edit-pharmacien.component').then(m => m.EditPharmacienComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Mon Profil',
          roles: ['Pharmacien']
        }
      },
      {
        path: 'edit-personnelA',
        loadComponent: () => import('./edit-personnel-admin/edit-personnel-admin.component').then(m => m.EditPersonnelAdminComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Mon Profil',
          roles: ['PersonnelAdministrative']
        }
      },
      {
        path: 'update-personnelA/:id',
        loadComponent: () => import('./update-personnel-a/update-personnel-a.component').then(m => m.UpdatePersonnelAComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Modifier Les Informations Du Personnel Administrative',
          roles: ['Admin']
        }
      },
      {
        path: 'update-medecin/:id',
        loadComponent: () => import('./update-medecin/update-medecin.component').then(m => m.UpdateMedecinComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Modifier Les Informations Du Medecin',
          roles: ['Admin']
        }
      },
      {
        path: 'update-pharmacien/:id',
        loadComponent: () => import('./update-pharmacien/update-pharmacien.component').then(m => m.UpdatePharmacienComponent),
        canActivate: [authGuard, roleGuard],
        data: {
          title: 'Modifier Les Informations Du Pharmacien',
          roles: ['Admin']
        }
      },
    ]
  }
];
