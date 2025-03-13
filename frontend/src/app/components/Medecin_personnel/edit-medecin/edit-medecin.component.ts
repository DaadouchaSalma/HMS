import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormLabelDirective, FormSelectDirective, ProgressComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { signal } from '@angular/core';
import { MedecinService } from '../../../services/medecin.service';
import { Medecin } from '../../../models/medecin.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-medecin',
  imports: [FormsModule,CommonModule, FormLabelDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, ButtonDirective,ColComponent,DatePickerComponent_1,ProgressComponent,
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent,FormSelectDirective],
  templateUrl: './edit-medecin.component.html',
  styleUrl: './edit-medecin.component.scss'
})
export class EditMedecinComponent implements OnInit {
    medecin: Medecin = new Medecin();
    position = 'top-end';
    visible = signal(false);
    percentage = signal(0);
    toastMessage = signal(''); 
    toastType = signal('success');
    isMedecin: boolean = false;
    constructor(private medecinService: MedecinService,private route: ActivatedRoute) {}

    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.medecinService.getMedecinById(id).subscribe({
          next : (data) => (this.medecin = data),
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
      this.medecinService.getMedecinById(id).subscribe(
        (medecin: Medecin) => {
          this.medecin = medecin;
          console.log('Données récupérées : ', medecin);
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
      if (!this.medecin.id) {
        this.toggleToast("L'ID du médecin est manquant", "error");
        return;
      }
      const updatedMedecin = {
        ...this.medecin,
        date_Naiss: this.formatDate(new Date(this.medecin.date_Naiss)),
      date_Emb: this.formatDate(new Date(this.medecin.date_Emb)),
        type: 1
      }
      console.log("Objet envoyé : ", updatedMedecin);
    
      this.medecinService.updateMedecin(this.medecin.id,updatedMedecin).subscribe({
        next : (response) =>{ this.toggleToast('Médecin mis à jour avec succès', 'success') ;
               console.log(response);
        },
        error : (error) => {this.toggleToast('Erreur lors de la mise à jour', 'error')
          console.log(error);
        }
      });
    }
}
