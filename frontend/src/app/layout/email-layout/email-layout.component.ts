import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonCloseDirective,
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular-pro';

import { DefaultAsideComponent, DefaultBreadcrumbComponent, DefaultFooterComponent, DefaultHeaderComponent } from '../default-layout';
import { navItems } from './_nav';

@Component({
  selector: 'app-email',
  templateUrl: './email-layout.component.html',
  styleUrls: ['./email-layout.component.scss'],
  imports: [SidebarComponent, SidebarHeaderComponent, SidebarBrandComponent, IconDirective, NgScrollbar, SidebarNavComponent, SidebarToggleDirective, SidebarTogglerDirective, DefaultHeaderComponent, ShadowOnScrollDirective, ContainerComponent, RouterOutlet, DefaultFooterComponent, DefaultAsideComponent, DefaultBreadcrumbComponent, ButtonCloseDirective]
})
export class EmailLayoutComponent {
  @HostBinding('class.c-app') cAppClass = true;

  public navItems = navItems;

  constructor() {}
}
