import { Component } from '@angular/core';
import {  FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
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
import { Medecin } from '../../../models/medecin.model';
import { MedecinService } from '../../../services/medecin.service';
@Component({
  selector: 'app-medecin-ajout',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,FormSelectDirective, FormsModule],
  templateUrl: './medecin-ajout.component.html',
  styleUrl: './medecin-ajout.component.scss'
})
export class MedecinAjoutComponent {

   medecin: Medecin = new Medecin();
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
  
    constructor(private medecinService: MedecinService) {}

    onSubmit(form: NgForm) {

      if (this.validateDateEmb() === false) {
        this.toggleToast('La date d\'embauche ne peut pas être dans le futur.', 'error');
        return; 
      }
      if (form.invalid) {
        Object.keys(form.controls).forEach((field) => {
          const control = form.controls[field];
          control.markAsTouched({ onlySelf: true });
        });
        return;
      }
      const medecin = {
        ...this.medecin,
        date_Naiss: this.formatDate(new Date(this.medecin.date_Naiss)),
        date_Emb: this.formatDate(new Date(this.medecin.date_Emb)),
        Type:1
      };
      console.log("Objet envoyé : ", medecin);
  
      this.medecinService.addMedecin(medecin).subscribe({
        next: (response) => {
          console.log('Medecin ajouté avec succès', response);
          this.toggleToast('Le medecin a été ajouté avec succès.', 'success');
          form.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout du medecin', err);
          this.toggleToast("Échec de l'ajout du medecin. Veuillez réessayer.", 'error');
        }
      });
    }

    validateDateEmb() {
      // Si la date d'embauche est définie
      if (this.medecin.date_Emb) {
        const today = new Date().toISOString().split('T')[0]; // Date du jour (YYYY-MM-DD)
        const embDate = new Date(this.medecin.date_Emb).toISOString().split('T')[0]; // Date d'embauche
    
        // Si la date d'embauche est dans le futur, retourner false
        if (embDate > today) {
          return false;
        }
        else {return true; }
      }else {return true; }
    }    
}
