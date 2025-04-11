import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseursService } from '../../../services/fournisseurs.service';
import { Fournisseur } from '../../../models/founisseur.model';
import { ActivatedRoute } from '@angular/router';

import {
  BadgeComponent,
  ButtonDirective,
  CollapseDirective,
  IColumn,
  TemplateIdDirective,
  ModalModule
} from '@coreui/angular-pro';
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ColComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  ProgressComponent,
  ToastComponent,
  ToastBodyComponent,
  ToastHeaderComponent,
  ToastModule
} from '@coreui/angular-pro';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '@coreui/angular-pro';

@Component({
  selector: 'app-update-fournisseur',
  imports: [
    BadgeComponent, ButtonDirective, CollapseDirective, TemplateIdDirective, ModalModule,
    ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent,
    ModalTitleDirective, ThemeDirective, FormsModule, AlertComponent, ToastBodyComponent, ToastHeaderComponent,
    ToastModule, CommonModule, ColComponent, ProgressComponent, ToastComponent
  ],
  templateUrl: './update-fournisseur.component.html',
  styleUrl: './update-fournisseur.component.scss'
})
export class UpdateFournisseurComponent {
  fournisseur: Fournisseur = { id: '', nomF: '', numTel: '', adresse: '', mail:'' };

  constructor(private fournisseursService: FournisseursService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get ID from URL
    if (id) {
      this.loadFournisseur(id);
    }
  }

  loadFournisseur(id: string) {
    this.fournisseursService.getFournisseurById(id).subscribe(data => {
      this.fournisseur = data;
    });
  }
  /** Fill form with fournisseur data */
  editFournisseur(fournisseur: Fournisseur) {
    this.fournisseur = { ...fournisseur }; // Copy fournisseur data into the form
  }

  onSubmit(): void {
    if (this.fournisseur.id != null) {
      this.fournisseursService.updateFournisseur(this.fournisseur.id, this.fournisseur).subscribe({
        next: () => {
          console.log('Fournisseur updated successfully');
          this.toggleToast("Fournisseur modifié avec succès!", 'success');
        },
        error: (err) => {
          console.error('Error updating fournisseur:', err);
          this.toggleToast("Erreur lors de la mise à jour du fournisseur.", 'error');
        }
      });
    } else {
      // Handle the case where the fournisseur.id is null (if necessary)
      console.error('Fournisseur ID is null');
      this.toggleToast("Fournisseur introuvable.", 'error');
    }
  }
  

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

  toggleToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.visible.update(value => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }

}
