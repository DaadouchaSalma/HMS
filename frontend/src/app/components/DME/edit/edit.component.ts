import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { DossierM } from 'src/app/models/DossierM.model';
import { DMEService } from 'src/app/services/dme.service';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ButtonModule, FormsModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  dme: DossierM = {
          id: '',
          matricule: 0,
          sexe: '',
          maladies_anterieures: [],
          maladies_familiaux: [],
          chirurgies: [],
          allergies: [],
          vaccinations: [],
          contact_urg: [],
          note: [],
          liste_analyse: []
      };
      position = 'top-end';
      visible = signal(false);
      percentage = signal(0);
      toastMessage = signal(''); 
      toastType = signal('success');
  
      constructor(private dmeService: DMEService, private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
          const { dmeId } = navigation.extras.state;
          this.dme.id = dmeId;
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
  
      if (this.dme.id) {
        this.dmeService.updateDme(this.dme.id, this.dme).subscribe({
          next: () => {
            console.log("Données envoyées:", this.dme);
            this.toggleToast('Le dme a été mis à jour avec succès.', 'success')
          },
          error: (error) => { 
            console.log(error); 
            console.log("Données envoyées:", this.dme);
            this.toggleToast('Échec du mis à jour du dme. Veuillez réessayer.', 'error');
          },
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
