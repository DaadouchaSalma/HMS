import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  BadgeComponent,
  ButtonDirective,
  ButtonGroupComponent,
  ButtonToolbarComponent,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ColDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular-pro';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss'],
    imports: [CardComponent, CardBodyComponent, FormDirective, FormLabelDirective, ColComponent, FormControlDirective, RowComponent, ButtonToolbarComponent, ButtonDirective, IconDirective, DropdownComponent, DropdownToggleDirective, RouterLink, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, ColDirective, ButtonGroupComponent]
})
export class ComposeComponent {}
