import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit,signal } from '@angular/core';
import { IconModule } from '@coreui/icons-angular';
import { Personnel } from '../../../models/personnel.model';
import {PersonnelService} from '../../../services/personnel.service';
import { Medecin } from '../../../models/medecin.model';
import { ButtonModule, CardModule, ColComponent, CollapseModule, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownModule, DropdownToggleDirective, FormSelectDirective, ListGroupModule, NavComponent, NavItemComponent, NavLinkDirective, TemplateIdDirective } from '@coreui/angular-pro';
import { ButtonDirective, CardBodyComponent, CardComponent, CollapseDirective } from '@coreui/angular-pro';
import { cilCalendarCheck } from '@coreui/icons';
import { RouterModule } from '@angular/router';
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personnel-list',
  imports: [CommonModule,IconModule,CollapseModule,ButtonDirective, CollapseDirective,ListGroupModule,ButtonModule,ButtonDirective,IconModule,RouterModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,ProgressComponent,
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent,FormSelectDirective,FormsModule,DropdownMenuDirective,DropdownItemDirective,DropdownToggleDirective,DropdownComponent,ColComponent],
  templateUrl: './personnel-list.component.html',
  styleUrl: './personnel-list.component.scss'
})
export class PersonnelListComponent implements OnInit {
  personnels: Personnel[] = [];
  medecins: Medecin[] = [];
  allPersonnel: (Personnel | Medecin)[] = [];
  error: string = '';
  expandedRows: Set<number> = new Set();
  collapseStates: boolean[] = [];
  icons = { cilCalendarCheck };
  visible_modal = false;
  selectedId: string | null = null;
  selectedType: number | null = null;
  selectedType__2: string = ''; // Filtre par type (vide = tous)
  selectedService: string = ''; // Filtre par service (pour les médecins)
  services = ['Chirurgie', 'Cardiologie', 'Pédiatrie', 'Gynécologie','Neurologie','Psychiatrie','Orthopédie'];
  filteredPersonnel: Personnel[] = [];

types = [
 // { label: 'Tous', value: '' },
  { label: 'Administratif', value: '0' },
  { label: 'Médecin', value: '1' },
  { label: 'Pharmacien', value: '2' }
];

  position = 'top-end';
  visible_toast = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
  

  getTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'Administratif';
      case 1: return 'Médecin';
      case 2: return 'Pharmacien';
      case 3:return  'Administrateur';
      default: return 'Inconnu';
    }
  }
  
  getTypeIcon(type: number): string {
    switch (type) {
      case 0: return 'fas fa-briefcase'; // Icône utilisateur
      case 1: return 'fas fa-user-md'; // Icône médecin
      case 2: return 'fas fa-pills'; // Icône pharmacien
      case 3: return 'fas fa-user-cog';
      default: return 'fas fa-question-circle';
    }
  }  
  
  constructor(private personnelService: PersonnelService, private medecinService:MedecinService,private pharmacienService:PharmacienService,private personnelAService:PersonnelAdminService) {}

  ngOnInit(): void {
    this.collapseStates = this.allPersonnel.map(() => false);
    this.loadPersonnels();
    //this.filteredPersonnel = [...this.allPersonnel];

    
  }
 
  
  loadPersonnels() {
    this.personnelService.getPersonnels().subscribe(
      (data: Personnel[]) => {
        this.personnels = data.filter(personnel => personnel.type === 0 || personnel.type === 2 );
        this.loadMedecins();
        console.log(this.personnels)
        this.mergeData(); // Fusionner les données après le filtrage
      },
      (error) => {
        this.error = 'Erreur lors de la récupération des personnels';
      }
    );
  }

    
  loadMedecins() {
    this.personnelService.getMedecins().subscribe(
      (data: Medecin[]) => {
        this.medecins = data;
        this.mergeData(); // Fusionner les données après le chargement
        console.log(this.medecins)
      },
      (error) => {
        this.error = 'Erreur lors de la récupération des médecins';
      }
    );
  }

  mergeData() {
    // Fusionner les deux tableaux
    this.allPersonnel = [...this.personnels, ...this.medecins];
    this.filteredPersonnel = [...this.allPersonnel];
  }

  hasMedecin(): boolean {
    return this.medecins.length > 0;
  }

  toggleDetails(index: number): void {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }
  // Toggle the collapse state for a given row index
  toggleCollapse(index: number): void {
    this.collapseStates[index] = !this.collapseStates[index];
  }

  // Return the current collapse state for a given row index
  visible(index: number): boolean {
    return !!this.collapseStates[index];
  }


  // Ouvrir la modale avec les infos de suppression
  openDeleteModal(id: string, type: number) {
    this.selectedId = id;
    this.selectedType = type;
    this.visible_modal = true;
  }

  // Fermer la modale
  closeModal() {
    this.visible_modal = false;
    this.selectedId = null;
    this.selectedType = null;
  }
  toggleLiveDemo() {
    this.visible_modal = !this.visible_modal;
  }

  handleLiveDemoChange(event: any) {
    this.visible_modal = event;
  }

  toggleToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.visible_toast.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible_toast.set($event);
    this.percentage.set(this.visible_toast() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }
// Supprimer après confirmation
confirmDelete() {
  if (this.selectedId !== null && this.selectedType !== null) {
    let deleteObservable;

    switch (this.selectedType) {
      case 0:
        deleteObservable = this.personnelAService.deletePersonnelA(this.selectedId);
        break;
      case 1:
        deleteObservable = this.medecinService.deleteMedecin(this.selectedId);
        break;
      case 2:
        deleteObservable = this.pharmacienService.deletePharmacien(this.selectedId);
        break;
      default:
        this.toggleToast('Type inconnu', 'error');
        return;
    }

    deleteObservable.subscribe({
      next: () => {
        this.closeModal(); // Fermer la modale après suppression
        this.loadPersonnels(); // Rafraîchir la liste des personnels
        //this.loadMedecins();
        this.toggleToast('Suppression réussie !', 'success'); // 🎉 Afficher un toast de succès
      },
      error: (err) => {
        console.error(err);
        this.toggleToast('Erreur lors de la suppression', 'error'); // ❌ Afficher un toast d'erreur
      }
    });
  }
}
getUpdateRoute(id: string, type: number): string {
  switch (type) {
    case 0:
      return `/personnel/update-personnelA/${id}`;
    case 1:
      return `/personnel/update-medecin/${id}`;
    case 2:
      return `/personnel/update-pharmacien/${id}`;
    default:
      return `/personnel/update-personnelA/${id}`; // Valeur par défaut
  }
}
filterPersonnel() {
  this.filteredPersonnel = this.allPersonnel.filter(personnel => {
   
    // Si aucun type n'est sélectionné, afficher tout
    if (!this.selectedType__2) {
      return true;
    }

    // Filtre par type
    if (this.selectedType__2 && personnel.type.toString() !== this.selectedType__2) {
      return false;
    }

    // Filtre par service (uniquement si Médecin est sélectionné et un service est choisi)
    if (this.selectedType__2 === '1' && this.selectedService) {
      
      if ('service' in personnel) { // 🔥 Vérifie la présence de 'service' au lieu d'instanceof
        return personnel.service === this.selectedService;
      }
      return false;
    }

    return true;
  });
}


selectType(type: string) {
  this.selectedType__2 = type;
  this.filterPersonnel();
}

selectService(service: string) {
  this.selectedService = service;
  this.filterPersonnel();
}

getTypeLabel_2(type: string): string {
  const foundType = this.types.find(t => t.value === type);
  return foundType ? foundType.label : '';
}

  
}
