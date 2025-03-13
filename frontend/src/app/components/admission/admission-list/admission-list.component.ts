import { Component,OnInit } from '@angular/core';
import { Admission } from '../../../models/admission.model';
import{AdmissionService} from'../../../services/services/admission.service';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
} from '@coreui/angular-pro';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admission-list',
  imports: [CommonModule , ModalComponent, ModalHeaderComponent, ModalTitleDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ButtonDirective],
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.scss'
})
export class AdmissionListComponent {
  admissions: Admission[] = [];
  admissionToSortir: Admission | null = null;
  isModalOpen: boolean = false;
  public visible = false;

  constructor(private admissionService: AdmissionService) {}

  ngOnInit(): void {
    this.loadAdmissions();
  }
  
    loadAdmissions() {
      this.admissionService.getAdmissions().subscribe((data: Admission[]) => {
        this.admissions = data;
        console.log("Données chargées :", this.admissions);
        
        // Une fois les données chargées, récupérer le résumé
        const summary = this.getAdmissionSummary();
        console.log("Résumé des admissions :", summary);
      });
    }
  getAdmissionSummary() {
    console.log("liste",this.admissions);
    return this.admissions.map(admission => ({
      patientNom: admission.patient.nom ?? 'Non renseigné',
      patientPrenom: admission.patient.prenom ?? 'Non renseigné',
      patientDateNaissance: admission.patient.date_Naiss ? new Date(admission.patient.date_Naiss).toLocaleDateString() : '-',
      chambreNumero: admission.chambre.numeroChambre ?? 'Aucune',
      dateAdmission: new Date(admission.dateAdmission).toLocaleDateString(),
      id: admission.id,
      chambreId: admission.chambreId
    }));
    
  }
    
  confirmerSortie(admission: Admission) {
    this.admissionToSortir = admission;
    this.visible = !this.visible;
  }
  fermerModal() {
    this.isModalOpen = false;
  }
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  sortirPatient() {
    if (this.admissionToSortir) {
      this.admissionService.sortirPatient(this.admissionToSortir.id).subscribe({
        next: () => {
          this.loadAdmissions();          
        },
        error: (err) => {
          console.error('Erreur lors de la sortie du patient', err);
          alert('Erreur lors de la sortie du patient.');
        }
      });
      this.toggleLiveDemo();
      this.admissionToSortir = null; 
    }
  }

  
  
}


