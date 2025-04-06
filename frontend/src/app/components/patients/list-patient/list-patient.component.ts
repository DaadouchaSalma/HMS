import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit,signal } from '@angular/core';
import { IconModule } from '@coreui/icons-angular';
import { Personnel } from '../../../models/personnel.model';
import {PersonnelService} from '../../../services/personnel.service';
import { Medecin } from '../../../models/medecin.model';
import { ButtonModule, CardModule, CollapseModule, FormSelectDirective, ListGroupModule, NavComponent, NavItemComponent, NavLinkDirective, TemplateIdDirective } from '@coreui/angular-pro';
import { ButtonDirective, CardBodyComponent, CardComponent, CollapseDirective } from '@coreui/angular-pro';
import { cilCalendarCheck } from '@coreui/icons';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedecinService } from '../../../services/medecin.service';
import { PharmacienService } from '../../../services/pharmacien.service';
import { PersonnelAdminService } from '../../../services/personnel-admin.service';
import {
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular-pro';
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective
} from '@coreui/angular-pro';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-patient',
  imports: [FormsModule, CommonModule,IconModule,CollapseModule,ListGroupModule,ButtonModule, IconModule,RouterModule],
  templateUrl: './list-patient.component.html',
  styleUrl: './list-patient.component.scss'
})
export class ListPatientComponent {

  patient: Patient = {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      grp_Sang: '',
      password: '',
      date_Naiss: '',
      telephone: '',
    };
    searchText: string = '';
    patients: any[] = [];

    constructor(private patientService: PatientService, private router: Router) {}

    ngOnInit(): void {
        this.loadPatients();
    }

    loadPatients() {
      this.patientService.getAllPatients().subscribe({
        next: (data) => {  
          this.patients = data;
        },
        error: (err) => {  
          console.error('Error loading patients:', err);
        }
      });

    }

    filteredPatients(): Patient[] {
      if (!this.searchText.trim()) {
        return this.patients;
      }
    
      const lowerSearch = this.searchText.toLowerCase();
    
      return this.patients.filter(patient => 
        (patient.dossierMedical?.matricule?.toString() || '').toLowerCase().includes(lowerSearch) ||
        (patient.nom || '').toLowerCase().includes(lowerSearch) ||
        (patient.prenom || '').toLowerCase().includes(lowerSearch) ||
        (patient.email || '').toLowerCase().includes(lowerSearch) ||
        (patient.telephone?.toString() || '').toLowerCase().includes(lowerSearch) ||
        (patient.date_Naiss?.toString() || '').toLowerCase().includes(lowerSearch) ||
        (patient.grp_Sang || '').toLowerCase().includes(lowerSearch)
      );
    } 
    
    editItem(dmeId: string) {
      this.router.navigate([`/dme/update`], { state: { dmeId: dmeId } });
    }
        
}
