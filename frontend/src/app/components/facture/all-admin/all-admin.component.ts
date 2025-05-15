import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../../services/facture.service';
import { Facture } from '../../../models/facture.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BadgeComponent, BadgeModule, ButtonModule, ColComponent, DatePickerComponent, DatePickerModule, TextColorDirective, ButtonDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective, 
  RowComponent,
  DateRangePickerComponent} from '@coreui/angular-pro';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-all-admin',
  imports: [FormsModule, CommonModule, BadgeComponent, TextColorDirective, BadgeModule, ColComponent, DatePickerModule, DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective, RowComponent, ColComponent, DateRangePickerComponent],
  templateUrl: './all-admin.component.html',
  styleUrl: './all-admin.component.scss'
})
export class AllAdminComponent implements OnInit {

  displayedColumns: string[] = ['id', 'dateFacture', 'totalGeneral', 'status'];
  factures: Facture[] = [];
  private stripe: any;
  filteredFactures: Facture[] = [];
  selectedStatus: string = '';
  dateRange: { startDate: Date | null, endDate: Date | null } = { startDate: null, endDate: null };
  
  constructor(private factureService: FactureService) {}
  
  ngOnInit(): void {
    this.factureService.getFactures().subscribe({
      next: (data) => {
                this.factures = data; 
                this.filteredFactures = [...data];  
              },
      error: (err) => console.error('Erreur lors de la récupération des factures:', err)
    });
  }

  applyFilter(): void {
  const { startDate, endDate } = this.dateRange;

  if ((this.selectedStatus === 'Tous' || this.selectedStatus === '') && 
      (!startDate || !endDate)) {
    this.filteredFactures = this.factures;
    return;
  }

  this.filteredFactures = this.factures.filter(facture => {
    const statusMatch = this.selectedStatus === 'Tous' || 
                        this.selectedStatus === '' || 
                        facture.status === this.selectedStatus;
    
    const factureDate = new Date(facture.dateFacture);
    const dateMatch = !startDate || !endDate || 
                     (factureDate >= startDate && factureDate <= endDate);

    console.log("Filtering with:", startDate, endDate, factureDate);

    return statusMatch && dateMatch;
  });
}


onDateChange(event: any) {
  console.log('Date range changed:', event);
  this.dateRange = event;
  this.applyFilter();
}

public customRanges = {
    "Aujourd'hui": [new Date(), new Date()],
    'Hier': [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1))
    ],
    '7 Derniers Jours': [
      new Date(new Date().setDate(new Date().getDate() - 6)),
      new Date()
    ],
    'Ce Mois-ci': [
      new Date(new Date().setDate(1)),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ],
    'Mois Précédent': [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    ],
    'Dernier Trimestre': [
    (() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const startMonth = lastQuarter * 3;
      const endMonth = startMonth + 2;
      return new Date(year, startMonth, 1);
    })(),
    (() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const endMonth = lastQuarter * 3 + 2;
      return new Date(year, endMonth + 1, 0);
    })()
  ],
  'Dernier Semestre': [
    (() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const isFirstSemester = currentMonth < 6;
      const year = isFirstSemester ? now.getFullYear() - 1 : now.getFullYear();
      const startMonth = isFirstSemester ? 6 : 0; // If Jan–Jun, last semester is Jul–Dec (6)
      return new Date(year, startMonth, 1);
    })(),
    (() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const isFirstSemester = currentMonth < 6;
      const year = isFirstSemester ? now.getFullYear() - 1 : now.getFullYear();
      const endMonth = isFirstSemester ? 11 : 5;
      return new Date(year, endMonth + 1, 0);
    })()
  ],
  'Année Dernière': [
    new Date(new Date().getFullYear() - 1, 0, 1),
    new Date(new Date().getFullYear() - 1, 11, 31)
  ]
  };

selectStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

resetFilters() {
  this.selectedStatus = '';
  this.dateRange = { startDate: null, endDate: null };
  this.applyFilter();
}

  getStatutClass(statut: string): string {
      switch (statut) {
        case 'Non Payée':
          return 'badge-nonpayee';
        case 'Payée':
          return 'badge-payee';
        default:
          return 'badge-unknown';
      }
    }
    
    getStatutIcon(statut: string): string {
      switch (statut) {
        case 'Payée': 
          return 'bi-check-circle';
        case 'Non Payée':
          return 'bi-x-circle';
        default:
          return 'bi-question-circle';
      }
    }

}