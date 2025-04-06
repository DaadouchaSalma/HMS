import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormLabelDirective, FormSelectDirective, ProgressComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pharmacien } from '../../../models/pharmacien.model';
import { PharmacienService } from '../../../services/pharmacien.service';

@Component({
  selector: 'app-update-pharmacien',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent ,  FormSelectDirective],
  templateUrl: './update-pharmacien.component.html',
  styleUrl: './update-pharmacien.component.scss'
})
export class UpdatePharmacienComponent implements OnInit {
  pharmacien: Pharmacien = new Pharmacien();
    position = 'top-end';
    visible = signal(false);
    percentage = signal(0);
    toastMessage = signal(''); 
    toastType = signal('success');
    constructor(private pharmacienService: PharmacienService,private route: ActivatedRoute) {}

    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.pharmacienService.getPharmacienByIdAdmin(id).subscribe({
          next : (data) => (this.pharmacien = data),
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

    getMedecin(id: string): void {
      this.pharmacienService.getPharmacienByIdAdmin(id).subscribe(
        (pharmacien: Pharmacien) => {
          this.pharmacien = pharmacien;
          console.log('Données récupérées : ', pharmacien);
        },
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
    onSubmit() {
      if (!this.pharmacien.id) {
        this.toggleToast("L'ID du pharmacien est manquant", "error");
        return;
      }
      const updatedpharmacien = {
        ...this.pharmacien,
        date_Naiss: this.formatDate(new Date(this.pharmacien.date_Naiss)),
        date_Emb: this.formatDate(new Date(this.pharmacien.date_Emb)),
        type: 2
      }
      console.log("Objet envoyé : ", updatedpharmacien);
    
      this.pharmacienService.updatePharmacienAdmin(this.pharmacien.id,updatedpharmacien).subscribe({
        next : (response) =>{ this.toggleToast('Pharmacien mis à jour avec succès', 'success') ;
               console.log(response);
        },
        error : (error) => {this.toggleToast('Erreur lors de la mise à jour', 'error')
          console.log(error);
        }
      });
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
