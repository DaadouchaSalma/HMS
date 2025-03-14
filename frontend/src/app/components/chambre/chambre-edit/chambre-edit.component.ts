import { Component ,signal,OnInit} from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormControlDirective, ReactiveFormsModule, FormsModule } from '@angular/forms';
import{ColComponent,ProgressComponent, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, FormDirective, FormLabelDirective, FormSelectDirective, ButtonDirective } from '@coreui/angular-pro';

import { ActivatedRoute,Router } from '@angular/router';
import { ChambreService } from '../../../services/services/chambre.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-chambre-edit',
  imports: [ColComponent, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, ButtonDirective,ProgressComponent,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent, NgIf],
  templateUrl: './chambre-edit.component.html',
  styleUrl: './chambre-edit.component.scss'
})
export class ChambreEditComponent implements OnInit {
  chambreForm: FormGroup;
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
  id!: string; 
  constructor(private fb: FormBuilder, private chambreService: ChambreService, private route: ActivatedRoute,private router: Router
  ) {
    this.chambreForm = this.fb.group({
      numeroChambre: ['', Validators.required],
      services: ['', Validators.required],
      niveau_dequipement: ['', Validators.required],
      nb_lit: ['', [Validators.required, Validators.min(1)]],
      etage: ['', [Validators.required, Validators.min(1)]],
      statut: ['', Validators.required]
    });
  }
    ngOnInit() {
      this.id = this.route.snapshot.paramMap.get('id') || '';
      if (this.id) {
        console.log(this.id);
        this.chargerChambre(this.id);
      }
    }
    chargerChambre(id: string) {
      this.chambreService.GetChambreById(id).subscribe({
        next: (chambre) => {
          if (chambre) {
            this.chambreForm.patchValue(chambre);
           
          }
        },
        error: () => {
          this.toggleToast('Erreur lors du chargement des données.', 'error');
        }
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
      if (this.chambreForm.valid) {
        this.chambreService.UpdateChambre(this.id, this.chambreForm.value).subscribe({
          next: () => {
            this.toggleToast('Chambre mise à jour avec succès !', 'success');
            this.router.navigate(['/chambre/chambreList']);
          },
          error: () => {
            this.toggleToast('Erreur lors de la mise à jour.', 'error');
          }
        });
      }
    }

}
