import { Component } from '@angular/core';
import { PersonnelAdmin } from '../../../models/personnelAdmin.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent],
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
  onSubmit() {
    const personnelA = {
      ...this.personnel,
      date_Naiss: this.formatDate(new Date(this.personnel.date_Naiss)),
      date_Emb: this.formatDate(new Date(this.personnel.date_Emb)),
      Type:0
    };

    this.personnelAdminService.addPersonnelAdministrative(personnelA).subscribe({
      next: (response) => {
        console.log('Personnel Administrative  ajouté avec succès', response);
        this.toggleToast('Le Personnel Administrative a été ajouté avec succès.', 'success');
      },
      error: (err) => {
        console.log('Personnel Administrative  ajouté avec succès', personnelA);
        console.error('Erreur lors de l’ajout du Personnel Administrative ', err);
        this.toggleToast("Échec de l'ajout du Personnel Administrative . Veuillez réessayer.", 'error');
      }
    });
  }
}
