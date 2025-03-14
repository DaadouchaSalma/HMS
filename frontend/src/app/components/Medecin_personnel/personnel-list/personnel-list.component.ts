import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit,signal } from '@angular/core';
import { IconModule } from '@coreui/icons-angular';
import { Personnel } from '../../../models/personnel.model';
import {PersonnelService} from '../../../services/personnel.service';
import { Medecin } from '../../../models/medecin.model';
import { ButtonModule, CardModule, CollapseModule, FormSelectDirective, ListGroupModule, NavComponent, NavItemComponent, NavLinkDirective, TemplateIdDirective } from '@coreui/angular-pro';
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

@Component({
  selector: 'app-personnel-list',
  imports: [CommonModule,IconModule,CollapseModule,ButtonDirective, CollapseDirective,ListGroupModule,ButtonModule,ButtonDirective,IconModule,RouterModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,ProgressComponent,
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent,FormSelectDirective],
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
      default: return 'Inconnu';
    }
  }
  
  getTypeIcon(type: number): string {
    switch (type) {
      case 0: return 'fas fa-briefcase'; // Icône utilisateur
      case 1: return 'fas fa-user-md'; // Icône médecin
      case 2: return 'fas fa-pills'; // Icône pharmacien
      default: return 'fas fa-question-circle';
    }
  }  
  
  constructor(private personnelService: PersonnelService, private medecinService:MedecinService,private pharmacienService:PharmacienService,private personnelAService:PersonnelAdminService) {}

  ngOnInit(): void {
    this.collapseStates = this.allPersonnel.map(() => false);
    this.loadPersonnels();
    //this.loadMedecins();
  }
 
  

  loadPersonnels() {
    this.personnelService.getPersonnels().subscribe(
      (data: Personnel[]) => {
        this.personnels = data;
        this.mergeData(); // Fusionner les données après le chargement
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
      },
      (error) => {
        this.error = 'Erreur lors de la récupération des médecins';
      }
    );
  }

  mergeData() {
    // Fusionner les deux tableaux
    this.allPersonnel = [...this.personnels, ...this.medecins];
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

  
}
