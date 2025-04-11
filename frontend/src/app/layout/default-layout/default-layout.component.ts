import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getUserRoles(); 
    this.navItems = this.filterNavItemsByRole(navItems, role);
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
