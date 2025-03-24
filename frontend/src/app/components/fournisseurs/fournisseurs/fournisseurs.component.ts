import { Component, OnInit } from '@angular/core';
import { FournisseursService } from '../../../services/fournisseurs.service';
import { Fournisseur } from '../../../models/founisseur.model';
import { CommonModule } from '@angular/common';
import {
  
  ButtonDirective,
  CollapseDirective,
  IColumn,
  SmartTableComponent,
  TemplateIdDirective,
  ModalModule
} from '@coreui/angular-pro';
import {
  ProgressComponent,
  ToastComponent,
  ToastBodyComponent,
  ToastHeaderComponent,
  ToastModule
} from '@coreui/angular-pro';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Import RouterModule


@Component({
  selector: 'app-fournisseurs',
  imports: [CommonModule, CollapseDirective, TemplateIdDirective, ModalModule,
    FormsModule,
    CommonModule,
    ProgressComponent,
    ToastComponent,
    ToastBodyComponent,
    ToastHeaderComponent,
    ToastModule,RouterModule],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.scss'
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];


  constructor(private fournisseurService: FournisseursService) {}

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data
        console.log(this.fournisseurs)
      },
      error: (err) => console.error('Error fetching fournisseurs:', err)
    });
  }

  deleteFournisseur(fournisseur: Fournisseur): void {
    if (!fournisseur?.id) {  // Use optional chaining
      console.error('Error: Fournisseur ID is undefined', fournisseur);
      return;
    }
  
    if (confirm(`Confirmer la suppression de ${fournisseur.nomF} ?`)) {
      this.fournisseurService.deleteFournisseur(fournisseur.id).subscribe({
        next: () => {
          this.fournisseurs = this.fournisseurs.filter(f => f.id !== fournisseur.id);
        },
        error: (err) => console.error('Error deleting fournisseur:', err)
      });
    }
  }

  
  

}
