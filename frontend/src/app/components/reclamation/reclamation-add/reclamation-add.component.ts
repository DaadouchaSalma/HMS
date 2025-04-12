import { Component, OnInit ,signal,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormBuilder, FormControlDirective, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../../services/reclamation.service';
import{ChambreService} from '../../../services/services/chambre.service';
import { ButtonDirective, CardComponent, CardHeaderComponent, ColComponent, FormCheckComponent, FormCheckInputDirective, FormDirective, FormLabelDirective, FormSelectDirective, MultiSelectOptgroupComponent, MultiSelectOptionComponent, ProgressComponent, RowComponent, TextColorDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, MultiSelectComponent as MultiSelectComponent_1, } from '@coreui/angular-pro';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import {Reclamation} from '../../../models/reclamation.model'
import { Chambre } from '../../../models/chambre.model';


@Component({
  selector: 'app-reclamation-add',
  imports: [ButtonDirective,FormSelectDirective,FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,ColComponent,CommonModule,TextColorDirective,ButtonDirective,FormsModule,ReactiveFormsModule, FormLabelDirective, CardComponent, CardHeaderComponent, MultiSelectOptionComponent, MultiSelectOptgroupComponent,FormCheckComponent, FormCheckInputDirective,ReactiveFormsModule,NgForOf,ProgressComponent,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent,NgIf,MultiSelectOptionComponent, MultiSelectOptgroupComponent,MultiSelectComponent_1],
  templateUrl: './reclamation-add.component.html',
  styleUrl: './reclamation-add.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReclamationAddComponent  implements OnInit {
  reclamationForm: FormGroup;
  chambres: any[] = [];
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

  // Liste des types de problèmes
  typesProblemes = [
    { value: 'Plomberie', label: 'Problème de plomberie' },
    { value: 'Électricité', label: 'Problème d\'électricité' },
    { value: 'Climatisation', label: 'Problème de climatisation' },
    { value: 'Hygiène', label: 'Problème d\'hygiène' },
    { value: 'Autre', label: 'Autre' },
  ];

  constructor( 
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private chambreService:ChambreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.reclamationForm = this.fb.group({
      typeProbleme: ['', Validators.required],
      description: ['', Validators.required],
      chambreId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      typeProbleme: ['', Validators.required],
      description: ['', Validators.required],
      chambreId: ['', Validators.required],
    });
    this.loadChambres();
  }
  loadChambres() {
   this.chambreService.GetChambres().subscribe((data: Chambre[]) => {
         this.chambres = data.map(chambre => ({
           value: chambre.id,
           label: `${chambre.numeroChambre}`
   
         }));
         console.log(this.chambres)  
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

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      this.reclamationForm.markAllAsTouched(); 
      return;
    }
  
    const reclamation: Reclamation = this.reclamationForm.value;
       
      this.reclamationService.addReclamation( reclamation).subscribe({
        next: () => {
          this.toggleToast('Admission ajoutée avec succès !', 'success');
          this.reclamationForm.reset(); 
        },
        error: () => {
          this.toggleToast("Erreur lors de l'ajout de l'admission", 'error');
        }
      });
  }
}  

 


