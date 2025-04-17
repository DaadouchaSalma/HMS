import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonCloseDirective,
  ContainerComponent,
  ImgModule,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular-pro';

import { DefaultAsideComponent, DefaultBreadcrumbComponent, DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthService } from '../../services/auth.service';
import { INavDataWithRoles } from './INavDataWithRoles';
import { ChatComponent } from '../../components/chatBot/chat/chat.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ChatComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultAsideComponent,
    DefaultBreadcrumbComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    ShadowOnScrollDirective,
    ButtonCloseDirective,
    ImgModule
  ]
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  userRole: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const roles  = this.authService.getUserRoles();
      
  if (roles.includes('Patient')) {
    this.userRole = 'Patient';
  } else if (roles.includes('Medecin')) {
    this.userRole = 'Medecin';
    this.router.navigate(['/personnel/edit-medecin']);
  }  else if (roles.includes('Pharmacien')) {
    this.userRole = 'Pharmacien';
    this.router.navigate(['/personnel/edit-pharmacien']);
  }  else if (roles.includes('PersonnelAdministrative')) {
    this.userRole = 'PersonnelAdministrative';
    this.router.navigate(['/personnel/edit-personnelA']);
  }  
    this.navItems = this.filterNavItemsByRole(navItems, roles);
  }

  private filterNavItemsByRole(items: INavDataWithRoles[], userRoles: string[]): INavDataWithRoles[] {
    return items
      .filter(item =>
        !item.roles || item.roles.some(role => userRoles.includes(role))
      )
      .map(item => ({
        ...item,
        children: item.children ? this.filterNavItemsByRole(item.children, userRoles) : undefined
      }));
  }
}
