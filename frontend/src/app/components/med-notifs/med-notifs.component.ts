import { Component } from '@angular/core';
import { MedNotifs } from '../../models/medNotifs.model';
import { MedNotifsService } from '../../services/med-notifs.service'

import { DropdownModule, ProgressModule, SharedModule, WidgetModule, ColComponent, RowComponent } from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { CommonModule } from '@angular/common'; // ✅ Import this!

@Component({
  selector: 'app-med-notifs',
  imports: [DropdownModule,CommonModule,
    ProgressModule,
    SharedModule,
    WidgetModule,
    IconModule,
    ChartjsModule,ColComponent, RowComponent],
  templateUrl: './med-notifs.component.html',
  styleUrl: './med-notifs.component.scss'
})
export class MedNotifsComponent {

  notifications: MedNotifs[] = [];
    constructor(private medNotifsService: MedNotifsService) {}
  
    
    ngOnInit(): void {
      this.medNotifsService.getMedNotifs().subscribe({
        next: (data) => {
          this.notifications = data
          console.log(this.notifications)
          console.log(this.notifications[0].message)
        },
        error: (err) => console.error('Error fetching notifications:', err)
      });
    }

    getLatestNotificationMessage(): string {
      return this.notifications.length > 0 ? this.notifications[0].message : 'Aucune notification';
    }

    deleteMedNotif(notif : MedNotifs): void {
        if (!notif?.id) {  // Use optional chaining
          console.error('Error: notification ID is undefined', notif);
          return;
        }
      
        if (confirm(`Confirmer la suppression de ${notif.message} ?`)) {
          this.medNotifsService.deleteMedNotif(notif.id).subscribe({
            next: () => {
              this.notifications = this.notifications.filter(f => f.id !== notif.id);
            },
            error: (err) => console.error('Error deleting notification:', err)
          });
        }
      }
    

}
