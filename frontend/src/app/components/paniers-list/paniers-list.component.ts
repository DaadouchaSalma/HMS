import { Component, signal } from '@angular/core';
import { PanierService } from '../../services/panier.service';
import { CommonModule } from '@angular/common';
import { Panier } from '../../models/panier.model';
import { ModalModule } from '@coreui/angular-pro';


import {
  
  ButtonDirective,
  CollapseDirective,
  IColumn,
  SmartTableComponent,
  TemplateIdDirective,ButtonModule
  
} from '@coreui/angular-pro';

import {
  ProgressComponent,
  ToastComponent,
  ToastBodyComponent,
  ToastHeaderComponent,
  ToastModule
} from '@coreui/angular-pro';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-paniers-list',
  standalone: true,
  imports: [CommonModule, ModalModule,   ButtonDirective,ButtonModule,
    CollapseDirective,
    SmartTableComponent,
    TemplateIdDirective,  ProgressComponent,
    ToastComponent,
    ToastBodyComponent,
    ToastHeaderComponent,
    ToastModule],
  templateUrl: './paniers-list.component.html',
  styleUrl: './paniers-list.component.scss'
})
export class PaniersListComponent {
  
  paniers: any[] = []; // Array to hold the panier data
  visible_modal: boolean = false;
  missingMeds: { medName: string; quantity: number }[] = [];
  selectedPanierId: string | null = null;

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.fetchPaniers();
  }

  fetchPaniers(): void {
    this.panierService.getAllPaniers().subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.paniers = data;
        }
        console.log('Paniers loaded:', this.paniers);
      },
      (error) => {
        console.error('Error fetching paniers:', error);
      }
    );
  }

  openValidationModal(panierId: string): void {
    this.selectedPanierId = panierId;

    if (!this.selectedPanierId) {
      console.log('No panier ID found', panierId);
      return;
    }

    // Find the selected panier and set missingMeds
    const selectedPanier = this.paniers.find(p => p.PanierId === panierId);
    this.missingMeds = selectedPanier?.MissingMedications || [];

    console.log('Missing Meds:', this.missingMeds);
    this.visible_modal = true;
  }

  closeModal(): void {
    this.visible_modal = false;
    this.selectedPanierId = null;
    this.missingMeds = [];
  }

  confirmValidation(): void {
    if (!this.selectedPanierId) {
      console.log('No panier ID found');
      return;
    }

    // Clear missing meds before making an API call
    this.missingMeds = [];

    this.panierService.validatePanier(this.selectedPanierId).subscribe(
      (response) => {
        console.log('Panier validated:', response);

        if (response.missingMeds && Array.isArray(response.missingMeds)) {
          this.missingMeds = response.missingMeds;
        }

        // Remove panier from list if it was deleted
        if (response.message.includes("deleted")) {
          this.paniers = this.paniers.filter(p => p.PanierId !== this.selectedPanierId);
        }
        this.panierService.refreshMissingMeds().subscribe({
          next: (res) => {
            console.log('Missing meds refreshed:', res);
          },
          error: (err) => {
            console.error('Failed to refresh missing meds:', err);
          }
        });
        this.toggleToast('Panier validé avec succée!', 'success');

        this.fetchPaniers();
        this.closeModal();
      },
      (error) => {
        this.toggleToast('Erreur lors de la validation du panier!', 'error');

        console.error('Error validating panier:', error);
      }
    );
  }

  handleModalChange(event: boolean): void {
    this.visible_modal = event;
  }
  details_visible: { [key: string]: boolean } = {};  // Ensure it's initialized as an object

 columns: IColumn[] = [
  { key: 'patientName', label: 'Patient' },  // Assuming 'Patient' has a 'nom' property
  { key: 'patientEmail', label: 'Email' },  // Assuming 'Patient' has an 'Email' property
  { key: 'show', label: '', _style: { width: '5%' }, filter: false, sorter: false },
  { key: 'valider', label: '', _style: { width: '5%' }, filter: false, sorter: false },
  { key: 'delete', label: '', _style: { width: '5%' }, filter: false, sorter: false }
];

  panierDetails: any = {};

  toggleDetails(panierID: string) {
    console.log("Panier passed to toggleDetails:", panierID);  // Log the panier object to see its structure
  
    if (!panierID) {
      console.warn('panier ID is undefined, cannot toggle details.');
      return;
    }
  
    // Log the current state of details_visible
    console.log("Before toggle, details_visible:", this.details_visible);
  
    if (!this.details_visible[panierID]) {
      this.details_visible[panierID] = true;  // Show details
      console.log("details_visible after setting true:", this.details_visible);
  
      // Fetch panier details if not already fetched for this specific panier
      console.log("getPanierById", panierID);  // Log the panier object to see its structure
  
      this.panierService.getPanierById(panierID).subscribe(
        (data) => {
          if (!data) {
            console.error("No data returned for panierID:", panierID);
            return;
          }
          this.panierDetails[panierID] = data;
          console.log("Fetched details for panier:", panierID, data);
        },
        (error) => {
          console.error("Error fetching panier details:", error);
        }
      );
  
    } else {
      this.details_visible[panierID] = false;  // Hide details
      this.panierDetails[panierID] = null;  // Optionally clear the details for this specific panier
      console.log("details_visible after setting false:", this.details_visible);
    }
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


      selectedId: string | null = null;
      visible_modal_supression: boolean = false;
    openDeleteModal(id: string, event?: MouseEvent) {
      event?.stopPropagation(); // Prevent event bubbling
      this.selectedId = id; // Store the selected panier ID
      this.visible_modal_supression = true; // Show the modal
    }
      onChangeStatusToSupprime() {
      if (this.selectedId) {
        // Call the service to change the status or delete the panier
        this.panierService.changePanierStatus(this.selectedId).subscribe(
          (response) => {
            console.log('Panier status changed to supprime:', response);
            this.toggleToast('Panier supprimé avec succès!', 'success'); // Success message
            this.fetchPaniers(); // Refresh the panier list
            this.closeModal(); // Close the modal after deletion
          },
          (error) => {
            console.error('Error changing panier status:', error);
            this.toggleToast('Erreur lors de la suppression du panier!', 'error'); // Error message
          }
        );
      }
    }
    

    closeModalSuppression(): void {
      this.visible_modal_supression = false; // Hide the modal
      this.selectedId = null; // Reset the selected ID
    }

    
    toggleLiveDemo() {
      this.visible_modal = !this.visible_modal;
    }
  
    handleLiveDemoChange(event: any) {
      this.visible_modal = event;
    }
      
    
}
