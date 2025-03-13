import { Component } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-patient',
  imports: [CommonModule, ButtonModule, FormsModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent, DatePickerComponent_1],
  templateUrl: './update-patient.component.html',
  styleUrl: './update-patient.component.scss'
})
export class UpdatePatientComponent {

  patient: Patient = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    grp_Sang: '',
    password: '',
    date_Naiss: '',
    telephone: ''
  };
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

  constructor(private patientService: PatientService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
    }
  }

  loadPatient(id: string) {
    this.patientService.getPatientById(id).subscribe({
      next: (data: Patient) => {
        this.patient = data;
      },
      error: () => {
        this.toggleToast('Erreur.', 'error');
      },
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  onSubmit() {
    const patient = {
      ...this.patient,
      date_Naiss: this.formatDate(new Date(this.patient.date_Naiss)),
    };

    console.log('hello world!', patient);

    if (this.patient.id) {
      this.patientService.updatePatient(this.patient.id, patient).subscribe({
        next: () => this.toggleToast('Le patient a été mis à jour avec succès.', 'success'),
        error: (error) => { console.log(error); this.toggleToast('Échec de l\'ajout du patient. Veuillez réessayer.', 'error')},
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
  
}