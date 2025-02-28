import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InboxMessageComponent } from '../inbox-message/inbox-message.component';
import { MailToolbarComponent } from '../mail-toolbar/mail-toolbar.component';
import { CardBodyComponent, CardComponent } from '@coreui/angular-pro';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss'],
    imports: [CardComponent, CardBodyComponent, MailToolbarComponent, InboxMessageComponent, RouterLink]
})
export class InboxComponent {}
