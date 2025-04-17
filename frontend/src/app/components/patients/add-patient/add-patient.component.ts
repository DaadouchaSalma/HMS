import { Component } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  imports: [CommonModule, ButtonModule, FormsModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent, DatePickerComponent_1],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent {

  patient: Patient = {
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
  today: Date = new Date();

  constructor(private patientService: PatientService, private router: Router) {
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    validateDateNaiss() {
   
      if (this.patient.date_Naiss) {
        const today = new Date().toISOString().split('T')[0];
        const DateNaiss = new Date(this.patient.date_Naiss).toISOString().split('T')[0]; 
    
        if (DateNaiss > today) {
          return false;
        }
        else {return true; }
      }else {return true; }
    }

  onSubmit(form: NgForm) {
    
    if (this.validateDateNaiss() === false) {
      this.toggleToast('La date de naissance ne peut pas être dans le futur.', 'error');
      return; 
    }

    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    
    const patient = {
      ...this.patient,
      date_Naiss: this.formatDate(new Date(this.patient.date_Naiss)),
    };

    this.patientService.createPatient(patient).subscribe({
      next: (response) => {
        console.log('patient ajouté avec succès', response);
        this.toggleToast('Le patient a été ajouté avec succès.', 'success');
        console.log(response.id);
        this.router.navigate(['../dme/new'], { state: { patientId: response.id } });
      },
      error: (err) => {
        const errorCode = err?.error[0]?.code;
        const errorDescription = err?.error[0]?.description;

        if (errorCode === 'DuplicateUserName') {
          this.toggleToast("L\'email est déjà utilisé", 'error');
        } else {
          this.toggleToast('Une erreur est survenue lors de l\'ajout.', 'error');
        }
        }
    });

    form.reset();
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

  passwordErrors: string[] = [];

  validatePassword(password: string) {
    this.passwordErrors = []; // Réinitialiser les erreurs
  
    if (!password) {
      this.passwordErrors.push("* Le mot de passe est requis.");
      return;
    }
    if (password.length < 6) {
      this.passwordErrors.push("Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (!/[A-Z]/.test(password)) {
      this.passwordErrors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
    }
    if (!/[0-9]/.test(password)) {
      this.passwordErrors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      this.passwordErrors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    }
  }

}