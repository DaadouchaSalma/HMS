import { HttpClient } from '@angular/common/http';
import { Component,signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule,Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective, ProgressComponent, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent } from '@coreui/angular-pro';
import { ChambreService } from '../../../services/services/chambre.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-chambre-add',
  imports: [ColComponent,  FormControlDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, ButtonDirective, ProgressComponent,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent,NgIf],
  templateUrl: './chambre-add.component.html',
  styleUrl: './chambre-add.component.scss',
  providers: [ChambreService] 
})
export class ChambreAddComponent {
  chambreForm:FormGroup;
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
  

  constructor(private fb: FormBuilder, private chambreService: ChambreService, private router: Router) {
    this.chambreForm = this.fb.group({
      numeroChambre: ['', Validators.required],
      services: ['Réanimation', Validators.required],
      niveau_dequipement: ['Basique', Validators.required],
      nb_lit: ['', [Validators.required, Validators.min(1)]],
      etage: ['', [Validators.required, Validators.min(1)]],
      statut: ['Disponible', Validators.required]
    });
  }
  toggleToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.visible.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }
  onSubmit() {
    if (this.chambreForm.invalid) {
      this.chambreForm.markAllAsTouched(); 
      return;
    }
      this.chambreService.AddChambre(this.chambreForm.value).subscribe({
        next: () => {
          this.toggleToast('Chambre ajoutée avec succès !', 'success');
          this.chambreForm.reset();
          
        },
        error: (err) => {
          if (err.error && err.error === 'Le numéro de chambre est déjà utilisé.') {
            this.toggleToast('Ce numéro de chambre est déjà utilisé.', 'error');
          } else {
            this.toggleToast('Erreur lors de l\'ajout de la chambre.', 'error');
          }
        }
      });
    }
  }
  


