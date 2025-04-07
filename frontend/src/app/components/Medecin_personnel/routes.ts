import { Routes } from '@angular/router';

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
        data: {
          title: 'Ajout Du Pharmacien'
        }
      },
      {
        path: 'add-personnel-admin',
        loadComponent: () => import('./add-personnel-admin/add-personnel-admin.component').then(m => m.AddPersonnelAdminComponent),
        data: {
          title: 'Ajout Du Personnel Administrative'
        }
      },
      {
        path: 'add-medecin',
        loadComponent: () => import('./medecin-ajout/medecin-ajout.component').then(m => m.MedecinAjoutComponent),
        data: {
          title: 'Ajout Du Medecin'
        }
      },
      {
        path: 'list-personnel',
        loadComponent: () => import('./personnel-list/personnel-list.component').then(m => m.PersonnelListComponent),
        data: {
          title: 'Liste Des personnels'
        }
      },
      {
        path: 'edit-medecin/:id',
        loadComponent: () => import('./edit-medecin/edit-medecin.component').then(m => m.EditMedecinComponent),
        data: {
          title: 'Mon Profil'
        }
      },
      {
        path: 'edit-pharmacien/:id',
        loadComponent: () => import('./edit-pharmacien/edit-pharmacien.component').then(m => m.EditPharmacienComponent),
        data: {
          title: 'Mon Profil'
        }
      },
      {
        path: 'edit-personnelA/:id',
        loadComponent: () => import('./edit-personnel-admin/edit-personnel-admin.component').then(m => m.EditPersonnelAdminComponent),
        data: {
          title: 'Mon Profil'
        }
      },
      {
        path: 'update-personnelA/:id',
        loadComponent: () => import('./update-personnel-a/update-personnel-a.component').then(m => m.UpdatePersonnelAComponent),
        data: {
          title: 'Modifier Les Informations Du Personnel Administrative'
        }
      },
      {
        path: 'update-medecin/:id',
        loadComponent: () => import('./update-medecin/update-medecin.component').then(m => m.UpdateMedecinComponent),
        data: {
          title: 'Modifier Les Informations Du Medecin'
        }
      },
      {
        path: 'update-pharmacien/:id',
        loadComponent: () => import('./update-pharmacien/update-pharmacien.component').then(m => m.UpdatePharmacienComponent),
        data: {
          title: 'Modifier Les Informations Du Pharmacien'
        }
      },
    ]
  }
];
