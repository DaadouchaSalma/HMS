import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../../services/facture.service';
import { Facture } from '../../../models/facture.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BadgeComponent, BadgeModule, ButtonModule, ColComponent, DatePickerComponent, DatePickerModule, TextColorDirective, ButtonDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective } from '@coreui/angular-pro';
import { BrowserModule } from '@angular/platform-browser';
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GenererPdfComponent } from '../generer-pdf/generer-pdf.component';

@Component({
  selector: 'app-historique',
  imports: [FormsModule, CommonModule, BadgeComponent, TextColorDirective, BadgeModule, ColComponent, DatePickerModule, DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {

displayedColumns: string[] = ['id', 'dateFacture', 'totalGeneral', 'status'];
factures: Facture[] = [];
private stripe: any;
  filteredFactures: Facture[] = [];
  selectedStatus: string = '';
  selectedDate: string = '';

constructor(private factureService: FactureService, private route: ActivatedRoute, private http: HttpClient) {}

ngOnInit(): void {
  this.factureService.getMyFactures().subscribe({
  next: (data) => {
                this.factures = data; 
                this.filteredFactures = [...data];  
              },
  error: (err) => console.error('Erreur lors de la récupération des factures:', err)
});
this.route.queryParams.subscribe(params => {
  const sessionId = params['session_id'];
  if (sessionId) {
    this.http.get<{ paid: boolean }>(`http://localhost:5160/session-status/${sessionId}`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (res.paid) {
            this.factureService.getMyFactures().subscribe({
              next: (data) => {
                this.factures = data; 
                this.filteredFactures = [...data];  
              },
            });
            window.location.replace('http://localhost:4200/#/facture/historique');
          }
        },
        error: (err) => console.error('Erreur lors de la vérification du paiement:', err)
      });
  }
});

this.loadStripe();
}

applyFilter() {
  if (this.selectedStatus === 'Tous' || this.selectedStatus === '' && !this.selectedDate) {
    this.filteredFactures = this.factures;
    return;
  }

  this.filteredFactures = this.factures.filter(facture => {
    const statusMatch = this.selectedStatus === 'Tous' || facture.status === this.selectedStatus;
    const dateMatch = !this.selectedDate || 
                      new Date(facture.dateFacture).toISOString().split('T')[0] === this.selectedDate;
    return statusMatch && dateMatch;
  });
}

selectStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

resetFilters() {
  this.selectedStatus = '';
  this.selectedDate = '';
  this.applyFilter();
}

getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente':
        return 'badge-nonpayee';
      case 'Non Payée':
        return 'badge-nonpayee';
      case 'Payée':
        return 'badge-payee';
      default:
        return 'badge-unknown';
    }
  }
  
  getStatutIcon(statut: string): string {
    //const status = statut?.toLowerCase();
    switch (statut) {
      case 'En attente':
        return 'bi-x-circle';
      case 'Payée': 
        return 'bi-check-circle';
      case 'Non Payée':
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  }

  async loadStripe() {
    this.stripe = await loadStripe('pk_test_51RIYcmR4Xlto1Mff3E5CbAULA8aD7SbfvGaUOuRfGaoo3xKSWBrYU3dpNiKvCd55Nc7x8BGH3y4URLCRIiQNl6dV00rdqXBb8r'); // Ta clé publique Stripe
  }

  async checkout(montant: number, factureId: string) {
    const response = await fetch(`http://localhost:5160/create-checkout-session/${montant}?factureId=${factureId}`, {
      method: 'POST',
      credentials: 'include'
    });

    const session = await response.json();

    const result = await this.stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  }

  generatePDF(factureId: string): void {
    this.http.post<Facture>(`http://localhost:5160/api/facture/generer/${factureId}`, {}).subscribe({
      next: (facture) => {
        this.factureService.generatePdf(facture);
      },
      error: (err) => {
        console.error('Erreur lors de la génération de la facture :', err);
      }
    });
  }

}
