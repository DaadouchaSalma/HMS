import { Component, NgModule } from '@angular/core';
import { PersonnelAdmin } from '../../../models/personnelAdmin.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {ButtonDirective, DatePickerComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormDirective, FormFloatingDirective, FormLabelDirective, FormSelectDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TextColorDirective,DatePickerComponent as DatePickerComponent_1,} from '@coreui/angular-pro';
import { signal } from '@angular/core';
import {
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular-pro';

import { ColComponent } from '@coreui/angular-pro';
import { CommonModule } from '@angular/common';
import { PersonnelAdminService } from '../../../services/personnel-admin.service';


@Component({
  selector: 'app-add-personnel-admin',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,FormSelectDirective,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent, FormsModule],
  templateUrl: './add-personnel-admin.component.html',
  styleUrl: './add-personnel-admin.component.scss'
})
export class AddPersonnelAdminComponent {
  personnel: PersonnelAdmin = new PersonnelAdmin();
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
 


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  constructor(private personnelAdminService: PersonnelAdminService) {}
  onSubmit(form: NgForm) {
    
  if (this.validateDateEmb() === false) {
    this.toggleToast('La date d\'embauche ne peut pas être dans le futur.', 'error');
    return; // Bloque l'envoi des données si la date est incorrecte
  }
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
    console.log('date',this.personnel.date_Naiss)
    const personnelA = {
      ...this.personnel,
      date_Naiss: this.formatDate(new Date(this.personnel.date_Naiss)),
      date_Emb: this.formatDate(new Date(this.personnel.date_Emb)),
      type:0
    };

    this.personnelAdminService.addPersonnelAdministrative(personnelA).subscribe({
      next: (response) => {
        console.log('Personnel Administrative  ajouté avec succès', response);
        this.toggleToast('Le Personnel Administrative a été ajouté avec succès.', 'success');
        form.reset();
      },
      error: (err) => {
        console.log('Personnel Administrative  ajouté avec succès', personnelA);
        console.error('Erreur lors de l’ajout du Personnel Administrative ', err);

        const errorCode = err?.error[0]?.code;
      const errorDescription = err?.error[0]?.description;

      if (errorCode === 'DuplicateUserName') {
        this.toggleToast("L\'email est déjà utilisé", 'error');
      } else {
        this.toggleToast('Une erreur est survenue lors de l\'ajout.', 'error');
      }
      }
    });
  }
  
  validateDateEmb() {
   
    if (this.personnel.date_Emb) {
      const today = new Date().toISOString().split('T')[0];
      const embDate = new Date(this.personnel.date_Emb).toISOString().split('T')[0]; 
  
      if (embDate > today) {
        return false;
      }
      else {return true; }
    }else {return true; }
  }

  validateDateNaiss() {
   
    if (this.personnel.date_Naiss) {
      const today = new Date().toISOString().split('T')[0];
      const DateNaiss = new Date(this.personnel.date_Naiss).toISOString().split('T')[0]; 
  
      if (DateNaiss > today) {
        return false;
      }
      else {return true; }
    }else {return true; }
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
    console.log(this.passwordErrors)
  }

}
