import { INavData } from '@coreui/angular-pro';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const navItems: INavData[] = [

  {
    name: 'Patient',
    url: '/patient',
    iconComponent: { name: 'cil-user-plus' },
    children: [
      {
        name: 'Ajouter un patient',
        url: '/patient/new',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Liste des patients',
        url: '/patient/list',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Prescription',
    url: '/prescription',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Ajouter une prescription',
        url: '/prescription/new',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Liste des prescriptions',
        url: '/prescription/listPrescription',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Dossier Medical',
    url: '/dossierM/dossierMListe',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'Dossier Medical M',
    url: '/dossierM/dossierMListeMedecin',
    iconComponent: { name: 'cil-notes' },
  },
  
  {
    name: 'Chambre',
    url: '/chambre',
    iconComponent: { name: 'cil-home' },
    children: [
      {
        name: 'Ajouter Une Chambre',
        url: '/chambre/chambreAdd',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'La liste des chambres',
        url: '/chambre/chambreList',
        icon: 'nav-icon-bullet'
      },
      
    ]},
    {
      name: 'Reclamation',
      url: '/reclamation',
      iconComponent: { name: 'cil-home' },
      children: [
        {
          name: 'Ajouter Une Reclamation',
          url: '/reclamation/reclamationAdd',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'La liste des reclamation',
          url: '/reclamation/reclamationList',
          icon: 'nav-icon-bullet'
        },
        
      ]},
    {
      name: 'Admission',
      url: '/admission',
      iconComponent: { name: 'cil-user' },
      children: [
        {
          name: 'Ajouter Admission',
          url: '/admission/admissionAdd',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Liste des admissions actuelles',
          url: '/admission/admissionList',
          icon: 'nav-icon-bullet'
        },
        
      ]},
  {
    name: 'Personnels',
    url: '/personnel',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Liste Des Personnels',
        url: '/personnel/list-personnel',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Stock Médical',
    url: '/',
    iconComponent: { name: 'cil-medical-cross' },
    children: [
      {
        name: 'Consulter',
        url: '/meds/meds',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Ajouter',
        url: '/meds/ajoutMed',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Fournisseurs',
        url: '/',
        iconComponent: { name: 'cilTruck' },
        children: [
          {
            name: 'Consulter',
            url: '/meds/fournisseurs',
            icon: 'nav-icon-bullet'
          },
          {
            name: 'Ajouter',
            url: '/meds/ajoutF',
            icon: 'nav-icon-bullet'
          },
        ]
      },
      {
        name: 'Catégories',
        url: '/meds/categorie',
        iconComponent: { name: 'cilTags' },
      },
      {
        name: 'Paniers',
        url: '/meds/paniers',
        iconComponent: { name: 'cilCart' },
      },

    ]
  },
  {
    name: 'Rendez-Vous',
    url: '/rendezvous',
    iconComponent: { name: 'cilCalendar' },
    children: [
      {
        name: 'Prendre Un Rendez-Vous',
        url: '/rendezvous/add-rdv',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Ma liste Des Rendez-Vous',
        url: '/rendezvous/list-rdv',
        icon: 'nav-icon-bullet'
      },
    ]
  },
 /*{
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },*/
 /* {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cards',
        url: '/base/cards',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carousel',
        url: '/base/carousel',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Collapse',
        url: '/base/collapse',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'List Group',
        url: '/base/list-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Navs & Tabs',
        url: '/base/navs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Pagination',
        url: '/base/pagination',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Placeholder',
        url: '/base/placeholder',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Progress',
        url: '/base/progress',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Spinners',
        url: '/base/spinners',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Button groups',
        url: '/buttons/button-groups',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Loading Button',
        url: '/buttons/loading-buttons',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'danger-gradient',
          text: 'PRO'
        }
      }
    ]
  },
  {
    name: 'Forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: '/forms/form-control',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Select',
        url: '/forms/select',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Multi Select',
        url: '/forms/multi-select',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'danger-gradient',
          text: 'PRO'
        }
      },
      {
        name: 'Checks & Radios',
        url: '/forms/checks-radios',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Range',
        url: '/forms/range',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Input Group',
        url: '/forms/input-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Floating Labels',
        url: '/forms/floating-labels',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Date Picker',
        url: '/forms/date-picker',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'danger-gradient',
          text: 'PRO'
        }
      },
      {
        name: 'Date Range Picker',
        url: '/forms/date-range-picker',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'danger-gradient',
          text: 'PRO'
        }
      },
      {
        name: 'Layout',
        url: '/forms/layout',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Time Picker',
        url: '/forms/time-picker',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'danger-gradient',
          text: 'PRO'
        }
      },
      {
        name: 'Validation',
        url: '/forms/validation',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Icons',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      {
        name: 'CoreUI Free',
        url: '/icons/coreui-icons',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: '/icons/flags',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'CoreUI Brands',
        url: '/icons/brands',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Modal',
        url: '/notifications/modal',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Toast',
        url: '/notifications/toasts',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Smart Table',
    url: '/smart-table',
    iconComponent: { name: 'cil-grid' },
    badge: {
      color: 'danger-gradient',
      text: 'PRO'
    }
  },
  {
    title: true,
    name: 'Plugins'
  },
  {
    name: 'Calendar',
    iconComponent: { name: 'cil-calendar' },
    url: '/plugins/calendar'
  },
  {
    name: 'Charts',
    iconComponent: { name: 'cil-chart' },
    url: '/plugins/charts'
  },
  {
    name: 'Google Maps',
    iconComponent: { name: 'cil-map' },
    url: '/plugins/google-maps'
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Apps',
    url: '/apps',
    iconComponent: { name: 'cil-layers' },
    children: [
      {
        name: 'Invoicing',
        iconComponent: { name: 'cil-spreadsheet' },
        url: '/apps/invoicing',
        children: [
          {
            name: 'Invoice',
            url: '/apps/invoicing/invoice',
            icon: 'nav-icon-bullet',
            badge: {
              color: 'danger-gradient',
              text: 'PRO'
            }
          }
        ]
      },
      {
        name: 'Email',
        url: '/apps/email',
        iconComponent: { name: 'cil-envelope-open' },
        children: [
          {
            name: 'Inbox',
            url: '/apps/email/inbox',
            icon: 'nav-icon-bullet',
            badge: {
              color: 'danger-gradient',
              text: 'PRO'
            }
          },
          {
            name: 'Message',
            url: '/apps/email/message',
            icon: 'nav-icon-bullet',
            badge: {
              color: 'danger-gradient',
              text: 'PRO'
            }
          },
          {
            name: 'Compose',
            url: '/apps/email/compose',
            icon: 'nav-icon-bullet',
            badge: {
              color: 'danger-gradient',
              text: 'PRO'
            }
          }
        ]
      }
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }

  }*/
];
