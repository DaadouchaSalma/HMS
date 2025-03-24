import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { PatientService } from '../../../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule,  NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, MultiSelectComponent, MultiSelectOptgroupComponent, MultiSelectOptionComponent, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,MultiSelectComponent as MultiSelectComponent_1, } from '@coreui/angular-pro';
import { signal } from '@angular/core';
import { DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';

@Component({
  selector: 'app-add-prescription',
  imports: [FormsModule, CommonModule, ButtonModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent, DatePickerComponent_1, MultiSelectComponent_1, MultiSelectOptionComponent, MultiSelectOptgroupComponent],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddPrescriptionComponent implements OnInit {
  prescription = {
    note: '',
    listeMed: '',
    medecinId: '',
    patientId: '',
  };
  patients: any[] = [];
  medications = [
    { nom: '', dosage: '', frequence: '', duree: '', voieAdministration: '', InstructionsSpeciales: '' } 
  ];
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

  constructor(private prescriptionService: PrescriptionService, private patientService: PatientService, private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.prescription.medecinId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        console.log('Fetched patients:', data); // Debugging log
        this.patients = data.map(patient => ({
          value: patient.id,
          label: `${patient.nom} ${patient.prenom} - ${patient.email}`
        }));
        console.log('Processed patients:', this.patients); // Debugging log
      },
      error: (err) => console.error('Error fetching patients', err),
    });
  }
  
  
  addMedication() {
    this.medications.push({ nom: '', dosage: '', frequence: '', duree: '', voieAdministration: '', InstructionsSpeciales: '' });
  }

  removeMedication(index: number) {
    this.medications.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    this.prescription.listeMed = JSON.stringify(this.medications);
    if (this.medications.length === 0) {
      this.toggleToast('If faut ajouter au moins un médicaments.', 'error');
      return; 
    }
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.prescriptionService.addPrescription(this.prescription).subscribe(
      response => {
        this.toggleToast('La prescription a été ajoutée avec succès.', 'success');
        form.reset();
      },
      error => {
        this.toggleToast("Échec de l'ajout de la prescription. Veuillez réessayer.", 'error');
      }
    );
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
}
