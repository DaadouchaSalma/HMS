import { Component,OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{DossierMService} from '../../../services/dossier-m.service'
import { NgFor, NgIf } from '@angular/common';
import { ButtonDirective } from '@coreui/angular-pro';

@Component({
  selector: 'app-dossier-list-medecin',
  imports: [NgIf,NgFor,ButtonDirective],
  templateUrl: './dossier-list-medecin.component.html',
  styleUrl: './dossier-list-medecin.component.scss'
})
export class DossierListMedecinComponent implements OnInit {
  dossier: any;

  constructor(
    private dossierService: DossierMService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const patientId = params.get('id');
      console.log('patient:',patientId)
      if (patientId) {
        this.dossierService.getDossierM(patientId).subscribe((data) => {
          this.dossier = data;
          console.log('Données reçues :', this.dossier);
          try {
            this.dossier.liste_analyse = JSON.parse(this.dossier.liste_analyse || '[]');
            this.dossier.liste_analyse = JSON.parse(this.dossier.liste_analyse || '[]');

            this.cdr.detectChanges();
          } catch (error) {
            console.error("Erreur de parsing JSON:", error);
            this.dossier.liste_analyse = [];
          }
          console.log('Analyses après parsing:', this.dossier.liste_analyse);
          this.cdr.detectChanges();
        });
      }
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
  

}
