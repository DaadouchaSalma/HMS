import { Component} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Chambre } from '../../../models/chambre.model';
import { ChambreService } from '../../../services/services/chambre.service';
import { BadgeComponent, BadgeModule, TextColorDirective } from '@coreui/angular-pro';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chambre-list',
  imports: [CommonModule,BadgeModule, RouterModule,TextColorDirective, BadgeComponent],
  templateUrl: './chambre-list.component.html',
  styleUrl: './chambre-list.component.scss',
  providers: [ChambreService] 
})
export class ChambreListComponent {
  
  chambres: Chambre[]= [];
  constructor( private chambreService: ChambreService) {}

  ngOnInit() {
    this.loadChambres();
  }

  loadChambres() {
    this.chambreService.GetChambres().subscribe((data) => {
      this.chambres = data;
      console.log(this.chambres);
    });
  }

  getStatutClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'disponible':
        return 'badge-libre';
      case 'occupée':
        return 'badge-occupee';
      case 'en maintenance':
        return 'badge-maintenance';
      default:
        return 'badge-libre';
    }
  }
  
  getStatutIcon(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'disponible':
        return 'bi-check-circle'; 
      case 'occupée':
        return 'bi-x-circle'; 
      case 'en maintenance':
        return 'bi-tools'; 
      default:
        return 'bi-question-circle';
    }
  }
  
}
