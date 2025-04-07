import { Component,ViewEncapsulation } from '@angular/core';
import { Reclamation } from '../../../models/reclamation.model';
import{ReclamationService} from '../../../services/reclamation.service'
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { AlignDirective, BorderDirective, ButtonCloseDirective, ButtonDirective, ButtonModule, ListGroupModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TableActiveDirective, TableColorDirective, TableDirective, ThemeDirective } from '@coreui/angular-pro';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reclamation-list',
  imports: [TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective, CommonModule,TableColorDirective,TableDirective, ButtonDirective,ListGroupModule,ButtonModule,ButtonDirective,IconModule,RouterModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,],
  templateUrl: './reclamation-list.component.html',
  styleUrl: './reclamation-list.component.scss',
  
})
export class ReclamationListComponent {
  allReclamations: Reclamation[] = [];
  visible: boolean = false;
  reclamationToSupprimer?: Reclamation;
  constructor(private reclamationService: ReclamationService) {}
  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe((reclamations) => {
      this.allReclamations = reclamations;
      console.log(this.allReclamations);
    });
  }

  confirmSupprimer(reclamation: Reclamation): void {
    this.reclamationToSupprimer = reclamation;
    this.visible = true;
  }

  supprimerReclamation(): void {
    if (this.reclamationToSupprimer && this.reclamationToSupprimer.id) {
      this.reclamationService.deleteReclamation(this.reclamationToSupprimer.id).subscribe(() => {
        this.loadReclamations(); 
        this.toggleLiveDemo();
      });
    }
  }

  toggleLiveDemo(): void {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any): void {
    this.visible = event;
  }


}
