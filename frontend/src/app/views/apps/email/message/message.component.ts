import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { MailToolbarComponent } from '../mail-toolbar/mail-toolbar.component';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent } from '@coreui/angular-pro';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    imports: [CardComponent, CardBodyComponent, MailToolbarComponent, IconDirective, BadgeComponent, ButtonDirective]
})
export class MessageComponent {}
