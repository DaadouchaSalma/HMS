import { Component } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { PatientService } from '../../../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule,  NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { signal } from '@angular/core';
import { DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';

@Component({
  selector: 'app-add-prescription',
  imports: [FormsModule, CommonModule, ButtonModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent, DatePickerComponent_1],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.scss'
})
export class AddPrescriptionComponent {
  prescription = {
    note: '',
    listeMed: '',
    medecinId: this.route.snapshot.paramMap.get('id') || '',
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
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error('Error fetching patients', err),
    });
  }
  
  addMedication() {
    this.medications.push({ nom: '', dosage: '', frequence: '', duree: '', voieAdministration: '', InstructionsSpeciales: '' });
  }

  removeMedication(index: number) {
    this.medications.splice(index, 1);
  }

  onSubmit() {
    this.prescription.listeMed = JSON.stringify(this.medications);

    this.prescriptionService.addPrescription(this.prescription).subscribe(
      response => {
        console.log('Prescription added successfully:', response);
      },
      error => {
        console.error('Error adding prescription:', error, this.prescription);
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
