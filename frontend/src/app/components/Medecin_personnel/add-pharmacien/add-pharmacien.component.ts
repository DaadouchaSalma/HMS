import { Component } from '@angular/core';
import { PharmacienService } from '../../../services/pharmacien.service';
import { Pharmacien } from '../../../models/pharmacien.model';
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

@Component({
  selector: 'app-add-pharmacien',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,FormsModule,FormSelectDirective],
  templateUrl: './add-pharmacien.component.html',
  styleUrl: './add-pharmacien.component.scss'
})
export class AddPharmacienComponent {
  

  pharmacien: Pharmacien = new Pharmacien();
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

  constructor(private pharmacienService: PharmacienService) {}
  
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
  
    const pharmacien = {
      ...this.pharmacien,
      date_Naiss: this.formatDate(new Date(this.pharmacien.date_Naiss)),
      date_Emb: this.formatDate(new Date(this.pharmacien.date_Emb)),
      type:2
    };
    console.log(pharmacien)

    this.pharmacienService.addPharmacien(pharmacien).subscribe({
      next: (response) => {
        console.log('Pharmacien ajouté avec succès', response);
        this.toggleToast('Le pharmacien a été ajouté avec succès.', 'success');
        form.reset();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du pharmacien', err);
        this.toggleToast("Échec de l'ajout du pharmacien. Veuillez réessayer.", 'error');
      }
    });
  }

  validateDateEmb() {
    // Si la date d'embauche est définie
    if (this.pharmacien.date_Emb) {
      const today = new Date().toISOString().split('T')[0]; // Date du jour (YYYY-MM-DD)
      const embDate = new Date(this.pharmacien.date_Emb).toISOString().split('T')[0]; // Date d'embauche
  
      // Si la date d'embauche est dans le futur, retourner false
      if (embDate > today) {
        return false;
      }
      else {return true; }
    }else {return true; }
  }

  validateDateNaiss() {
   
    if (this.pharmacien.date_Naiss) {
      const today = new Date().toISOString().split('T')[0];
      const DateNaiss = new Date(this.pharmacien.date_Naiss).toISOString().split('T')[0]; 
  
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
  }
}
