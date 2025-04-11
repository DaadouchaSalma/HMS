import { ChangeDetectorRef, Component,OnInit, ViewEncapsulation,ElementRef,ViewChild } from '@angular/core';
import{DossierMedical} from '../../../models/dossierM.model';
import{DossierMService} from '../../../services/dossier-m.service'
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RoundedDirective, RowComponent, TabDirective, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent, TabsModule,ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, FormDirective, FormLabelDirective   } from '@coreui/angular-pro';
import { IconDirective, IconSetModule,IconSetService} from '@coreui/icons-angular';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControlDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-dossier-list',
  imports: [CardBodyComponent,
          CardComponent,
          CardHeaderComponent,
          ColComponent,
          RoundedDirective,
          TabDirective,
          TabPanelComponent,
          TabsComponent,
          TabsContentComponent,
          TabsListComponent,
          IconDirective,
          TabsModule,
          IconSetModule,
          NgForOf,
          NgIf,
          ButtonDirective,
          FormsModule,
          FormLabelDirective,FormsModule, FormDirective,ReactiveFormsModule,ModalComponent, ModalHeaderComponent, ModalTitleDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, ButtonDirective
         ],
  templateUrl: './dossier-list.component.html',
  styleUrl: './dossier-list.component.scss',
  encapsulation: ViewEncapsulation.None 
})
export class DossierListComponent implements OnInit {
  dossier!: any;
  panes: { name: string; icon: string; content: string }[] = [];
  selectedDossierId: string = '';
  selectedFile: File | null = null;
  nomAnalyse: string = '';
  isModalOpen: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  public visible = false;
  constructor(private dossierService: DossierMService , private cdr: ChangeDetectorRef , private route: ActivatedRoute , private iconSet: IconSetService) {
   
  }
  ouvrirModalAjouterAnalyse(dossierId: string) {
    console.log("Bouton cliqué, ouverture du modal pour le dossier:", dossierId);
    this.selectedDossierId = dossierId;
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
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  ajouterAnalyse() {
    if (!this.selectedFile || !this.nomAnalyse.trim()) {
      alert('Veuillez fournir un nom et sélectionner un fichier.');
      return;
    }

    this.dossierService.ajouterAnalyse(this.selectedDossierId, this.selectedFile, this.nomAnalyse)
      .subscribe(response => {
        
        if (!response || !response.fichierUrl) {
          console.error('Erreur : fichierUrl est manquant dans la réponse');
          alert('Erreur lors de l\'upload, le fichierUrl est manquant.');
          return;
        }
        this.dossier = {
          ...this.dossier,
          liste_analyse: [
            ...this.dossier.liste_analyse,
            { nom: this.nomAnalyse, fichierUrl: response.fichierUrl }
          ]
        };
  
        console.log('Nouvelle liste analyses:', this.dossier.liste_analyse);
  
        // Rafraîchir la liste
        this.setupTabs(); 
        this.cdr.detectChanges(); 
        this.nomAnalyse = '';
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        this.toggleLiveDemo();
        
      }, error => {
        console.error('Erreur lors de l\'ajout de l\'analyse:', error);
        alert('Erreur lors de l\'ajout de l\'analyse');
      });
  }

  telechargerFichier(fichierUrl: string) {
    if (!this.dossier || !this.dossier.id) {
      console.error("ID du dossier introuvable !");
      return;
    }
  
    const dossierId = this.dossier.id;
  
    this.dossierService.telechargerAnalyse(dossierId, fichierUrl).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fichierUrl.split('/').pop() || 'fichier_telecharge';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du fichier', err);
        alert('Échec du téléchargement du fichier.');
      }
    });
  }
  

ngOnInit(): void {
        this.dossierService.getDossier().subscribe((data) => {
          this.dossier = data;
          console.log('Before parse:', this.dossier.liste_analyse);
          console.log('Before parsing:', this.dossier.liste_analyse);
this.dossier.liste_analyse = JSON.parse(this.dossier.liste_analyse || '[]');
this.dossier.liste_analyse = JSON.parse(this.dossier.liste_analyse || '[]');
this.dossier.liste_analyse = this.dossier.liste_analyse.map((analyse: any) => ({
  ...analyse,
  nom: analyse.nom.replace(/^"|"$/g, '') 
}));
        
this.setupTabs();
console.log('After parsing:', this.dossier.liste_analyse);
console.log('Type after parsing:', typeof this.dossier.liste_analyse);
          
         
        });
      }   
  

  setupTabs(): void {
    this.panes = [
      { name: 'Historique Médical', icon:"fa-solid fa-stethoscope", content: this.getHistoriqueMedical()},
      { name: 'Analyses Médicales', icon:"fa-solid fa-flask", content: this.getAnalyses() },   
    ];
    this.cdr.detectChanges();
  }

  getHistoriqueMedical(): string {
    return `
      <div class="hist">
        <p class="hist_ma"><i class="fas fa-virus"></i>
          <strong >Maladies antérieures:</strong> ${this.dossier?.maladies_antérieures?.join(', ') || 'N/A'}
        </p>
        <p class="hist_mf"><i class="fas fa-dna" ></i>
          <strong >Maladies familiales:</strong> ${this.dossier?.maladies_familiaux?.join(', ') || 'N/A'}
        </p>
        <p class="hist_ch"><i class="fas fa-user-md" ></i>
          <strong>Chirurgies:</strong> ${this.dossier?.chirurgies?.join(', ') || 'N/A'}
        </p>
        <p class="hist_all"><i class="fas fa-allergies" ></i>
          <strong >Allergies:</strong> ${this.dossier?.allergies?.join(', ') || 'N/A'}
        </p>
        <p class="hist_vacc"><i class="fas fa-syringe" ></i>
          <strong >Vaccinations:</strong> ${this.dossier?.vaccinations?.join(', ') || 'N/A'}
        </p>
      </div>
    `;
}

  /*getAnalyses(): string {
    if (!this.dossier?.liste_analyse?.length) {
      return '<p>Aucune analyse disponible.</p>';
    }
  
    return `
      <ul class="analyses-list">
        ${this.dossier.liste_analyse
          .map((analyse: { nom: string; fichierUrl: string }) =>
            `<li>${analyse.nom}   <button cButton (click)="telechargerFichier(analyse.fichierUrl)" class="telecharger-link bg-primary"><i class="fa-solid fa-download"></i> Télécharger</button></li>`
          )
          .join('')}
      </ul>
    `;
  }*/
    getAnalyses(): string {
      return this.dossier?.liste_analyse || [];
    }
 
    
  
}
