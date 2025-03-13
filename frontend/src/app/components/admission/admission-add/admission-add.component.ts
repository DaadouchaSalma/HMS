import { Component,OnInit, CUSTOM_ELEMENTS_SCHEMA,signal } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  MultiSelectComponent as MultiSelectComponent_1,
  MultiSelectOptgroupComponent,
  MultiSelectOptionComponent,
  RowComponent,
  TextColorDirective,
  FormCheckComponent, FormCheckInputDirective,
  ProgressComponent,ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,DatePickerComponent as DatePickerComponent_1
} from '@coreui/angular-pro';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Patient } from '../../../models/patient.model';
import { Chambre } from '../../../models/chambre.model';
import { AdmissionService } from '../../../services/services/admission.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';


@Component({
  selector: 'app-admission-add',
  imports: [RowComponent,ColComponent,CommonModule,TextColorDirective, CardComponent, CardHeaderComponent,MultiSelectComponent_1, MultiSelectOptionComponent, MultiSelectOptgroupComponent,FormCheckComponent, FormCheckInputDirective,ReactiveFormsModule,NgForOf,ProgressComponent,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent,NgIf],
  templateUrl: './admission-add.component.html',
  styleUrl: './admission-add.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdmissionAddComponent  implements OnInit{
  admissionForm: FormGroup;
  patients: any[] = [];
  chambres: Chambre[] = [];
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
  constructor(private fb: FormBuilder, private admissionService: AdmissionService) {
    this.admissionForm = this.fb.group({
      patientId: ['', Validators.required],
      motif: ['', Validators.required],
      services: ['', Validators.required],
      niveau_dequipement: ['', Validators.required],
      chambreId: ['', Validators.required],
      dateAdmission: ['', Validators.required]
    });
  } 
  ngOnInit() {
    this.loadPatients();
    setTimeout(() => console.log("liste après 1s", this.patients), 1000);

  }
  loadPatients() {
    this.admissionService.getPatients().subscribe((data: Patient[]) => {
      this.patients = data.map(patient => ({
        value: patient.id,
        label: `${patient.nom} ${patient.prenom} - ${this.formatDate(patient.date_Naiss)}`

      }));
      console.log(this.patients)  
    });
    
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  loadChambres() {
    const services = this.admissionForm.get('services')?.value;
    const niveau_dequipement = this.admissionForm.get('niveau_dequipement')?.value;
    if (services && niveau_dequipement) {
      this.admissionService.getChambresDisponibles(services, niveau_dequipement).subscribe((data: Chambre[]) => {
        this.chambres = data;
        console.log(this.chambres)
      });
    }
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
    submitForm() {
      if (this.admissionForm.invalid) {
        this.admissionForm.markAllAsTouched(); 
        const invalidFields = Object.keys(this.admissionForm.controls)
          .filter(key => this.admissionForm.get(key)?.invalid);
    
        if (invalidFields.length > 0) {
          this.toggleToast(`Veuillez remplir tous les champs obligatoires.`, 'error');
        }
        return; 
      }
      this.admissionService.addAdmission(this.admissionForm.value).subscribe({
        next: () => {
          this.toggleToast('Admission ajoutée avec succès !', 'success');
          this.admissionForm.reset();
        },
        error: () => {
          this.toggleToast("Erreur lors de l'ajout de l'admission", 'error');
        }
      });
    }
    
    
  
}
