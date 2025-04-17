import { Component,CUSTOM_ELEMENTS_SCHEMA, OnInit,signal } from '@angular/core';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormLabelDirective, FormSelectDirective,DatePickerComponent as DatePickerComponent_1 ,TimePickerComponent as TimePickerComponent_1, DropdownCloseDirective, TemplateIdDirective,MultiSelectComponent as MultiSelectComponent_1,
  MultiSelectOptgroupComponent,
  MultiSelectOptionComponent,
  ModalFooterComponent,
  ModalBodyComponent,
  ButtonCloseDirective,
  ThemeDirective,
  ModalTitleDirective,
  ModalHeaderComponent,
  ModalComponent,} from '@coreui/angular-pro';
import { RdvService } from '../../../services/rdv.service';
import { RendezVous } from '../../../models/rdv.model';
import { CommonModule } from '@angular/common';
import {
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular-pro';



@Component({
  selector: 'app-add-rdv',
  imports: [CommonModule, FormLabelDirective,ReactiveFormsModule,FormsModule,FormDirective,FormSelectDirective,ColComponent,ButtonDirective,DatePickerComponent_1,TimePickerComponent_1,DropdownCloseDirective,TemplateIdDirective,MultiSelectComponent_1,MultiSelectOptionComponent, MultiSelectOptgroupComponent, ProgressComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
  ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,ProgressComponent,],
  templateUrl: './add-rdv.component.html',
  styleUrl: './add-rdv.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddRdvComponent implements OnInit{
  today: Date = new Date();
  time? = '';
  rendezVous: RendezVous = new RendezVous();
  message: string = '';
  medecins: any[] = [];
  selectedMedecin: string | null = null;
  isModalVisible: boolean = false;
 //rendezVous = { date_RDV: '', time_RDV: '' }; //submit jdida
 selectedTime: string | null = null;
 heuresDisponibles: string[] | null = null;
 patientId: string='';
  //selectedMedecin: string = '';
   position = 'top-end';
    visible = signal(false);
    percentage = signal(0);
    toastMessage = signal(''); 
    toastType = signal('success');

  constructor(private rdvService: RdvService) {
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    // Charger la liste des médecins au démarrage du composant
    this.rdvService.getMedecins().subscribe(
      (medecins) => {
        this.medecins = medecins;
        // Optionally set a default selected doctor if needed:
       /* if (this.medecins.length > 0) {
          this.selectedMedecin = this.medecins[0].id; // Example: set the first doctor's ID as default
        }*/
      },
      (error) => {
        this.message = 'Erreur lors du chargement des médecins.';
        console.error('Erreur:', error);
      }
    );
  }


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
  
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    onMedecinChange() {
      this.rendezVous.date_RDV = '';
      //this.heuresDisponibles = [];
      this.selectedTime = null;
    }


      onDateChange(event: Date) {
        //this.heuresDisponibles = null; // réinitialiser à chaque sélection de date
        if (this.selectedMedecin && event) {
          const date_RDV = this.formatDate(event); 
      
          console.log('Date sélectionnée (formatée) :', date_RDV);
      
          this.rdvService.getDisponibilites(this.selectedMedecin, date_RDV).subscribe({
            next: (dispos) => {
              console.log('Heures disponibles reçues (brutes) :', dispos);
      
              // Extraire uniquement les heures et minutes (en retirant les secondes)
              this.heuresDisponibles = dispos.map(time => time.substring(0, 5));
      
              console.log('Heures disponibles (formatées) :', this.heuresDisponibles);
              this.selectedTime = null;
            },
            error: () => (this.heuresDisponibles = []),
          });
        }
      }
      
    
   // Sélectionner une heure
   selectTime(heure: string) {
    this.selectedTime = heure;
  }

  // Soumettre le rendez-vous
  onSubmit(form: NgForm) {
    if (form.invalid || !this.selectedTime) return;
    console.log('date avant format',this.rendezVous.date_RDV)
    // Utiliser la fonction formatDate pour formater la date correctement
  const formattedDate = this.formatDate(new Date(this.rendezVous.date_RDV));

  console.log("Selected Time:", this.selectedTime);
  console.log("Formatted Date:", formattedDate);

  const rendezVous = {
    medecinId: this.selectedMedecin,
    date_RDV: formattedDate, // Envoyer la date formatée
    time_RDV: this.selectedTime,
  };
    this.rdvService.addRendezVous(rendezVous).subscribe({
      next: () => {
        this.toastMessage.set('Rendez-vous pris avec succès !'); 
        this.toastType.set('success');
        this.visible.set(true);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur lors de la prise de rendez-vous.';
        this.toastMessage.set(errorMsg);
        this.toastType.set('error');
        this.visible.set(true);
      },
    });
  }

  ajouterALaListeAttente() {
    // Créer un objet avec les informations nécessaires
    const rdv = {
      //patientId: "1e52f1bf-f923-4952-8fcf-31fb58fe3583",  // Vérifie que patientId est un GUID valide
      medecinId: this.selectedMedecin,
      date_RDV:this.formatDate(new Date( this.rendezVous.date_RDV )), // S'assurer que date_RDV est bien formatée
      
    };
  
    this.rdvService.ajouterALaListeAttente(rdv).subscribe(
      response => {
        this.isModalVisible = false;  // Fermer le modal après la confirmation
        this.toastMessage.set('Ajout à la liste d\'attente avec succès.');
        this.toastType.set('success');
        this.visible.set(true);
      },
      error => {
        this.toastMessage.set('Erreur lors de l\'ajout à la liste d\'attente.');
        this.toastType.set('error');
        this.visible.set(true);
      }
    );
  }
    openAttenteModal() {
      this.isModalVisible = true;
    }
  
    toggleLiveDemo(): void {
      this.isModalVisible = !this.isModalVisible;
    }
    handleLiveDemoChange(event: any): void {
      this.isModalVisible = event;
    }
}
