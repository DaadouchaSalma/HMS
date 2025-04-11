import { Component } from '@angular/core';
import{PrescriptionService} from '../../../services/prescription.service';
import {Prescription} from '../../../models/prescription.model'
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgTemplateOutlet } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';

import { BorderDirective, ButtonCloseDirective, ButtonDirective, ButtonModule, CardBodyComponent, CardComponent, CardFooterComponent, CardGroupComponent, CardHeaderComponent, CardImgDirective, CardLinkDirective, CardSubtitleDirective, CardTextDirective, CardTitleDirective, ColComponent, CollapseDirective, CollapseModule, FormSelectDirective, GutterDirective, ListGroupDirective, ListGroupItemDirective, ListGroupModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, PopoverDirective, ProgressComponent, RowComponent, TabDirective, TabPanelComponent, TabsContentComponent, TabsListComponent, ThemeDirective } from '@coreui/angular-pro';

@Component({
  selector: 'app-list-prescription',
  imports: [CommonModule,RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,NgFor,NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,ButtonDirective, PopoverDirective],
  templateUrl: './list-prescription.component.html',
  styleUrl: './list-prescription.component.scss'
})
export class ListPrescriptionComponent {
  prescriptions: Prescription[] = [];

  constructor(
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
   
    
      this.prescriptionService.getPrescriptions().subscribe(data => {
        this.prescriptions = data.map(prescription => ({
          ...prescription,
          datePrescription: this.formatDate(new Date (prescription.datePrescription!))
          
        }));
        console.log(this.prescriptions)
      });
    
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return ` ${year}-${month}-${day}`;
  }


  downloadPrescription(prescription: Prescription): void {
    console.log(prescription);
    if(prescription.id != null){
      this.prescriptionService.generatePdf(prescription.id).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Prescription.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      }, error => {
        console.error('Download failed', error);
      });
    }
    
  } 
 }
