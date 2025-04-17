import { Routes } from '@angular/router';
import { DefaultLayoutComponent, EmailLayoutComponent } from './layout';
import { ChambreAddComponent } from './components/chambre/chambre-add/chambre-add.component';
import { AddPharmacienComponent } from './components/Medecin_personnel/add-pharmacien/add-pharmacien.component';
import { MedecinAjoutComponent } from './components/Medecin_personnel/medecin-ajout/medecin-ajout.component';
import { authGuard } from './auth.guard';
import { roleGuard } from './role.guard';


export const routes: Routes = [
  //
  /*{ path: 'add-pharmacien', component: AddPharmacienComponent },
  { path: 'add-personnel', component: AddPersonnelComponent },
  { path: 'add-medecin', component: MedecinAjoutComponent },
  { path: '', redirectTo: '/add-pharmacien', pathMatch: 'full' },*/
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  {
    path: 'apps/email',
    component: EmailLayoutComponent,
    canActivate: [authGuard, roleGuard],

    children: [
      {
        path: '',
        loadChildren: () => import('./views/apps/email/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path: 'chat',
        loadChildren: () => import('./components/chatBot/routes').then((m) => m.routes),
      },
      {
        path: 'messagerie',
        loadChildren: () => import('./components/messagerie/routes').then((m) => m.routes),
      },
      {

        path:'dossierM',
        loadChildren: () => import('./components/dossierM/routes').then((m) => m.routes),
      },
      {

        path:'chambre',
        loadChildren: () => import('./components/chambre/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path:'reclamation',
        loadChildren: () => import('./components/reclamation/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path:'admission',
        loadChildren: () => import('./components/admission/routes').then((m) => m.routes)
      },
      {
        path: 'personnel',
        loadChildren: () => import('./components/Medecin_personnel/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }

      },
      {
        path: 'rendezvous',
        loadChildren: () => import('./components/RDV/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'smart-table',
        loadChildren: () => import('./views/smart-tables/routes').then((m) => m.routes)
      },
      {
        path: 'plugins',
        loadChildren: () => import('./views/plugins/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      
      {
        path: 'apps',
        loadChildren: () => import('./views/apps/routes').then((m) => m.routes)
      },
      {
        path: 'patient',
        loadChildren: () => import('./components/patients/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path: 'prescription',
        loadChildren: () => import('./components/prescription/routes').then((m) => m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path:'meds',
        loadChildren:() => import('./components/routes').then((m)=> m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      },
      {
        path:'dme',
        loadChildren:() => import('./components/DME/routes').then((m)=> m.routes),
        data: { roles: ['PersonnelAdministratif'] }
      }
    ]
  }, 
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },

  { path: '**', redirectTo: 'dashboard' },
];
