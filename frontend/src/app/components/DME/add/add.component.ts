import { Component, signal } from '@angular/core';
import { DossierM } from '../../../models/DossierM.model';
import { DMEService } from '../../../services/dme.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  imports: [CommonModule, ButtonModule, FormsModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
      dme: DossierM = {
        matricule: 0,
        sexe: '',
        maladies_anterieures: [],
        maladies_familiaux: [],
        chirurgies: [],
        allergies: [],
        vaccinations: [],
        contact_urg: [],
        note: [],
        liste_analyse: [],
        patientId: ''
    };
    position = 'top-end';
    visible = signal(false);
    percentage = signal(0);
    toastMessage = signal(''); 
    toastType = signal('success');

    constructor(private dmeService: DMEService, private router: Router) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        const { patientId } = navigation.extras.state;
        this.dme.patientId = patientId;
      }
    }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const listFields = [
      'maladies_anterieures',
      'maladies_familiaux',
      'chirurgies',
      'allergies',
      'vaccinations',
      'contact_urg',
      'note',
      'liste_analyse'
    ];
  
    listFields.forEach((field) => {
      const key = field as keyof DossierM; 
    
      if (typeof this.dme[key] === 'string') {
        (this.dme[key] as any) = (this.dme[key] as unknown as string).split(',').map(item => item.trim());
      }
    
      if (!Array.isArray(this.dme[key])) {
        (this.dme[key] as any) = [];
      }
    });    

    this.dmeService.createDme(this.dme).subscribe({
      next: (response) => {
        console.log('DME ajouté avec succès', response);
        this.toggleToast('Le dossier médical a été ajouté avec succès.', 'success');
        console.log("patientId envoyé :", this.dme.patientId);
        this.router.navigateByUrl('/patient/list');
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du dossier médical', err);
        console.log("patientId envoyé :", this.dme.patientId);
        this.toggleToast("Échec de l'ajout du dossier médical. Veuillez réessayer.", 'error');
      }
    });
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
