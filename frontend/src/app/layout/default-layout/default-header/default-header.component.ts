import { CommonModule, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, Output, ViewChild ,EventEmitter} from '@angular/core';
import { MedNotifsService } from '../../../services/med-notifs.service';
import { MedNotifs } from '../../../models/medNotifs.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {RdvService} from '../../../services/rdv.service';
import { Router} from '@angular/router';
import { SidebarComponent, SidebarService } from '@coreui/angular-pro'; // selon ta version
import { HeaderModule } from '@coreui/angular-pro';



import {
  AvatarComponent,
  BadgeComponent,
  ButtonDirective,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormControlDirective,
  FormDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ProgressComponent,
  SidebarToggleDirective
} from '@coreui/angular-pro';
import { FormsModule, NgModel } from '@angular/forms';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { cilPowerStandby,
  cilMenu,
  cilUser,
  cilEnvelopeOpen,
  cilBell,
  cilListRich,
  cilLanguage,
  cilSun,
  cilMoon,
  cilContrast,
  cilAccountLogout } from '@coreui/icons';
//import { ChatComponent } from 'src/app/components/chatBot/chat/chat.component';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [HeaderModule,FormsModule, CommonModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, RouterLink, NgTemplateOutlet, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, NgStyle, FormDirective,FormsModule,CommonModule],
  providers: [IconSetService]
})
export class DefaultHeaderComponent extends HeaderComponent {
  notifications: { title: string, message: string }[] = [];
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });
  userRole: string = '';

 

  
  constructor(private medNotifsService: MedNotifsService ,private authService: AuthService, public router: Router, iconSet: IconSetService,private rdvService: RdvService ,  private route: ActivatedRoute,private sidebarService: SidebarService) {
    super();
    iconSet.icons = { 
      cilPowerStandby,
      cilMenu,
      cilUser,
      cilEnvelopeOpen,
      cilBell,
      cilListRich,
      cilLanguage,
      cilSun,
      cilMoon,
      cilContrast,
      cilAccountLogout
    };
  }


   loadNotifications() {
    this.rdvService.getNotifications().subscribe(response => {
      this.notifications = response.map((notif, index) => ({
        title: `Rappel`,
        message: notif
      }));
      console.log(this.notifications);
    }, error => {
      console.error('Erreur lors du chargement des notifications', error);
    });
 
}

 /* getProfileRoute(): string {
    if (this.userRole === 'Patient') {
      return '/patient/update';
    } else if (this.userRole === 'Medecin') {
      return '/dashboard';
    }
    return '/patient/list'; 
  }*/

  logout(): void {
    localStorage.removeItem('userRoles');
    this.authService.logout().subscribe();
    console.log(localStorage.getItem('userRoles'));
    this.router.navigate(['/login']);
  }


  public Mednotifications: MedNotifs[] = [];
  public ExpiryNotifications: MedNotifs[] = [];
  public StockNotifications: MedNotifs[] = [];


ngOnInit(): void {
  this.loadNotifications();
  
  this.medNotifsService.getMedNotifs().subscribe({
    next: (data) => {
      this.Mednotifications = data;
  
      // Separate notifications
      this.ExpiryNotifications = data.filter((notif) => notif.message.startsWith('Le'));
      this.StockNotifications = data.filter((notif) => notif.message.startsWith('Il'));
  
      console.log('Le notifications:', this.ExpiryNotifications);
      console.log('Il notifications:', this.StockNotifications);
    },
    error: (err) => console.error('Error fetching notifications:', err)
  });
  this.loadNotifications();
  const roles  = this.authService.getUserRoles();
      
  if (roles.includes('Patient')) {
    this.userRole = 'Patient';
  } else if (roles.includes('Medecin')) {
    this.userRole = 'Medecin';
    this.router.navigate(['/personnel/edit-medecin']);
  }  else if (roles.includes('Pharmacien')) {
    this.userRole = 'Pharmacien';
    this.router.navigate(['/personnel/edit-pharmacien']);
  }  else if (roles.includes('PersonnelAdministratif')) {
    this.userRole = 'PersonnelAdministratif';
    this.router.navigate(['/personnel/edit-personnelA']);
  }  
  console.log("roles",this.userRole)
}
navigateTo() {
  if (this.userRole.includes('Medecin')) {
    this.router.navigate(['/personnel/edit-medecin']);
  }  else if (this.userRole.includes('Pharmacien')) {
    this.userRole = 'Pharmacien';
    this.router.navigate(['/personnel/edit-pharmacien']);
  }  else if (this.userRole.includes('PersonnelAdministratif')) {
    this.userRole = 'PersonnelAdministratif';
    this.router.navigate(['/personnel/edit-personnelA']);
  }  
}


  sidebarId = input('sidebar1');

  public newMessages = [
    {
      id: 0,
      from: 'Jessica Williams',
      avatar: '7.jpg',
      status: 'success',
      title: 'Urgent: System Maintenance Tonight',
      time: 'Just now',
      link: 'apps/email/inbox/message',
      message: 'Attention team, we\'ll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...'
    },
    {
      id: 1,
      from: 'Richard Johnson',
      avatar: '6.jpg',
      status: 'warning',
      title: 'Project Update: Milestone Achieved',
      time: '5 minutes ago',
      link: 'apps/email/inbox/message',
      message: 'Kudos on hitting sales targets last quarter! Let\'s keep the momentum. New goals, new victories ahead...'
    },
    {
      id: 2,
      from: 'Angela Rodriguez',
      avatar: '5.jpg',
      status: 'danger',
      title: 'Social Media Campaign Launch',
      time: '1:52 PM',
      link: 'apps/email/inbox/message',
      message: 'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...'
    },
    {
      id: 3,
      from: 'Jane Lewis',
      avatar: '4.jpg',
      status: 'info',
      title: 'Inventory Checkpoint',
      time: '4:03 AM',
      link: 'apps/email/inbox/message',
      message: 'Team, it\'s time for our monthly inventory check. Accurate counts ensure smooth operations. Let\'s nail it...'
    },
    {
      id: 4,
      from: 'Ryan Miller',
      avatar: '3.jpg',
      status: 'info',
      title: 'Customer Feedback Results',
      time: '3 days ago',
      link: 'apps/email/inbox/message',
      message: 'Our latest customer feedback is in. Let\'s analyze and discuss improvements for an even better service...'
    }
  ];

  public newNotifications = [
    { id: 0, title: 'New user registered', icon: 'cilUserFollow', color: 'success' },
    { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
    { id: 2, title: 'Sales report is ready', icon: 'cilChartPie', color: 'info' },
    { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
    { id: 4, title: 'Server overloaded', icon: 'cilSpeedometer', color: 'warning' }
  ];

  public newStatus = [
    { id: 0, title: 'CPU Usage', value: 25, color: 'info', details: '348 Processes. 1/4 Cores.' },
    { id: 1, title: 'Memory Usage', value: 70, color: 'warning', details: '11444GB/16384MB' },
    { id: 2, title: 'SSD 1 Usage', value: 90, color: 'danger', details: '243GB/256GB' }
  ];

  public newTasks = [
    { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
    { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
    { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
    { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
    { id: 4, title: 'Angular Version', value: 100, color: 'success' }
  ];

}
