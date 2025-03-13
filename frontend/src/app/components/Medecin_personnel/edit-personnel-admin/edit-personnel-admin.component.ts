import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormLabelDirective, FormSelectDirective, ProgressComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonnelAdmin } from '../../../models/personnelAdmin.model';
import { PersonnelAdminService } from '../../../services/personnel-admin.service';

@Component({
  selector: 'app-edit-personnel-admin',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
          ToasterComponent,
          ToastComponent,
          ToastHeaderComponent,
          ToastBodyComponent ,  FormSelectDirective],
  templateUrl: './edit-personnel-admin.component.html',
  styleUrl: './edit-personnel-admin.component.scss'
})
export class EditPersonnelAdminComponent implements OnInit{
personnelA: PersonnelAdmin = new PersonnelAdmin();
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

  constructor(private personnelAService: PersonnelAdminService,private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personnelAService.getPersonnelAById(id).subscribe({
        next : (data) => (this.personnelA = data),
        error :(error) => this.toggleToast('Erreur lors de la récupération des données', 'error')
    });
    }
  }

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

  
  
  onSubmit() {
    if (!this.personnelA.id) {
      this.toggleToast("L'ID du pharmacien est manquant", "error");
      return;
    }
    const updatedpharmacien = {
      ...this.personnelA,
      date_Naiss: this.formatDate(new Date(this.personnelA.date_Naiss)),
    date_Emb: this.formatDate(new Date(this.personnelA.date_Emb)),
      type: 2
    }
    console.log("Objet envoyé : ", updatedpharmacien);
  
    this.personnelAService.updatePersonnelA(this.personnelA.id,updatedpharmacien).subscribe({
      next : (response) =>{ this.toggleToast('Personnel Administrative mis à jour avec succès', 'success') ;
             console.log(response);
      },
      error : (error) => {this.toggleToast('Erreur lors de la mise à jour', 'error')
        console.log(error);
      }
    });
  }
}
