import { Component, signal } from '@angular/core';
import { MedicamentService } from '../../services/medicament.service';
import { Medicament } from '../../models/medicaments.model';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FournisseursService } from '../../services/fournisseurs.service';
import { Fournisseur } from '../../models/founisseur.model';
import { CategorieService } from '../../services/categorie.service';
import { CategorieMedicament } from '../../models/categorie.model';
import { PanierService } from '../../services/panier.service';


import {
  ButtonDirective,
  ModalModule
} from '@coreui/angular-pro';
import {
  ColComponent,
  ProgressComponent,
  ToastComponent,
  ToastBodyComponent,
  ToastHeaderComponent,
  ToastModule
} from '@coreui/angular-pro';
import { FormsModule, NgForm } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-ajout-med',
  imports: [ ButtonDirective,  ModalModule,
 
      FormsModule,ToastBodyComponent,ToastHeaderComponent,ToastModule,
      CommonModule,ColComponent,ProgressComponent,ToastComponent],
  templateUrl: './ajout-med.component.html',
  styleUrl: './ajout-med.component.scss'
})
export class AjoutMedComponent {

  constructor(private panierService : PanierService ,private medicamentService: MedicamentService, private fournisseurService :FournisseursService, private categorieService : CategorieService) {}
  fournisseurs: Fournisseur[] = [];
  categories : CategorieMedicament[] = [];

  medicament: Medicament = {
    id: '', 
    nom: '',
    description: '',
    nbr_stock: 0,
    fournisseurId:'',
    categorieId:'',
    date_Exp: new Date()
  };


ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs = data;
    });
    this.categorieService.getCategories().subscribe(dataC => {
      this.categories = dataC;
      console.log(dataC);
    });
  
}



  isInvalidDate(): boolean {
      const today = new Date();
      const expirationDate = new Date(this.medicament.date_Exp);
      return expirationDate <= today;
  }
  
  onSubmit(form : NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    if (this.medicament.nbr_stock < 0) {
      this.toggleToast("Le stock ne peut pas être négatif!", 'error');
      return;
    }
    if (this.isInvalidDate()) {
      this.toggleToast("La date d'expiration doit être après aujourd'hui!", 'error');
      return;
    }

    console.log('Form data being sent to backend:', this.medicament);
    const { id, ...medicamentData } = this.medicament;
    //medicamentData.fournisseurId = this.medicament.fournisseurId;

    this.medicamentService.addMedicament(medicamentData).pipe(
      tap(response => {
        console.log('Medicament added successfully:', response);
        this.toggleToast("Médicament ajouté avec succés!",'success');
        form.resetForm();

        this.medicament = { id: '', nom: '', description: '', nbr_stock: 0, fournisseurId:'' , categorieId:'',
        date_Exp: new Date() }; // Reset form
        this.panierService.refreshMissingMeds().subscribe({
          next: (res) => {
            console.log('Missing meds refreshed:', res);
          },
          error: (err) => {
            console.error('Failed to refresh missing meds:', err);
          }
        });
              }),
      catchError(error => {
        console.error('Error adding medicament:', error);
        this.toggleToast('Erreur lors de l\'ajout du médicament!', 'error');

        
        return of(null); 
      })
    ).subscribe();
  }
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');

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
