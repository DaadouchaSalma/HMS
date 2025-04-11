import { AfterViewInit, Component, OnInit, ViewChild ,signal} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { ButtonCloseDirective, ButtonModule, CardBodyComponent, CardComponent, CardHeaderComponent, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, TextColorDirective, ThemeDirective } from '@coreui/angular-pro';
import { RdvService } from '../../../services/rdv.service';
import { Renderer2 } from '@angular/core';
import { cilX } from '@coreui/icons';
import {
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular-pro';

@Component({
  selector: 'app-annuler-rdv',
  imports: [TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FullCalendarModule, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,ButtonModule,ProgressComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent],
  templateUrl: './annuler-rdv.component.html',
  styleUrl: './annuler-rdv.component.scss'
})
export class AnnulerRdvComponent implements OnInit, AfterViewInit{
 position = 'top-end';
     visible = signal(false);
     percentage = signal(0);
     toastMessage = signal(''); 
     toastType = signal('success');

  visible_modal: boolean = false;
  eventIdToCancel: string | null = null;
  events: any[] = [];
  //today = new Date();
  //todayStr: string = this.today.toISOString().replace(/T.*$/, '');
  //viewTime = '17:00';
  calendarOptions: CalendarOptions = {
    plugins: [
      /*dayGridPlugin,*/
      interactionPlugin,
      listPlugin,
      //timeGridPlugin
    ],
    //initialDate: this.todayStr,
    weekNumberCalculation: 'ISO',
    height: 'auto',
    contentHeight: 'auto',
    //aspectRatio: 2,
    initialView: 'listYear',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'listYear'
    },
    editable: true,
    selectable: true,
    droppable: true,
    navLinks: true,
    events: this.events,
    //events: this.events,
    themeSystem: 'bootstrap5',
    locale:'fr',

     // 🔥 Ajout du bouton "Annuler"
  /*eventContent: (arg) => {
    let btn = document.createElement('button');
    btn.innerText = 'Annuler';
    btn.classList.add('btn', 'btn-danger', 'btn-sm'); // Style Bootstrap
    //btn.onclick = () => this.rendezVousService.annulerRendezVous(arg.event.id);
    btn.style.backgroundColor = '#dc3545';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '5px 10px';
    btn.style.fontSize = '12px';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.marginLeft = '10px';

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.openModal(arg.event.id); // 🔥 Ouvre le modal au lieu d'annuler directement
    });

    let div = document.createElement('div');
    div.innerHTML = `<b>${arg.event.title}</b>`;
    div.appendChild(btn);

    return { domNodes: [div] };
  }*/
   /* eventContent: (arg) => {
      let div = this.renderer.createElement('div');
      
      // 🔥 Appliquer un affichage en ligne (flex) pour aligner le titre et le bouton
      this.renderer.setStyle(div, 'display', 'flex');
      this.renderer.setStyle(div, 'align-items', 'center'); // Centre verticalement
      this.renderer.setStyle(div, 'gap', '50px'); // Espacement entre le titre et le bouton
    
      let title = this.renderer.createElement('b');
      this.renderer.setProperty(title, 'innerText', arg.event.title);
      this.renderer.appendChild(div, title);
      this.renderer.setStyle(title,'width','50%')

      let btnWrapper = this.renderer.createElement('div');
      this.renderer.setStyle(btnWrapper,'margin-left','40%')
      let btn = this.renderer.createElement('button');
      this.renderer.setProperty(btn, 'innerText', 'Annuler');
      this.renderer.setAttribute(btn, 'class', 'btn btn-primary px-3 py-0');
      this.renderer.setStyle(btn,'font-size','0.8rem')
    
      // ✅ Définir les styles du bouton
      this.renderer.setStyle(btn, 'border-radius', '5px');
      this.renderer.setStyle(btn, 'background-color', 'rgb(196, 57, 57)');
      this.renderer.setStyle(btn, 'color', 'white');
      this.renderer.setStyle(btn, 'border', 'none');
    
      this.renderer.listen(btn, 'click', (event) => {
        event.stopPropagation();
        this.openModal(arg.event.id); // 🔥 Ouvre le modal
      });
    
      this.renderer.appendChild(btnWrapper, btn);
      this.renderer.appendChild(div, btnWrapper); // Ajouter le bouton juste après le titre
    
      return { domNodes: [div] };
    }*/
      eventContent: (arg) => {
        let div = this.renderer.createElement('div');
      
        // 🔥 Utilisation de flexbox pour aligner le titre et le bouton
        this.renderer.setStyle(div, 'display', 'flex');
        this.renderer.setStyle(div, 'align-items', 'center'); 
        this.renderer.setStyle(div, 'gap', '40px'); 
      
        let title = this.renderer.createElement('b');
        this.renderer.setProperty(title, 'innerText', arg.event.title);
        this.renderer.appendChild(div, title);
        this.renderer.setStyle(title,'width','30%')
        let btnWrapper = this.renderer.createElement('div');
      
        let btn = this.renderer.createElement('button');
        this.renderer.setAttribute(btn, 'class', 'btn btn-primary px-2 py-2');
      
        // ✅ Définition des styles du bouton
        this.renderer.setStyle(btn, 'border-radius', '5px');
        this.renderer.setStyle(btn, 'background-color', 'rgb(196, 57, 57)');
        this.renderer.setStyle(btn, 'color', 'white');
        this.renderer.setStyle(btn, 'border', 'none');
        this.renderer.setStyle(btn, 'display', 'flex');
        this.renderer.setStyle(btn, 'align-items', 'center');
        this.renderer.setStyle(btn, 'justify-content', 'center');
        //this.renderer.setStyle(btn, 'width', '30px');
       // this.renderer.setStyle(btn, 'height', '30px');
        this.renderer.setStyle(btn, 'padding', '5px');
      
        // ✅ Ajout de l'icône `cil-x`
        let icon = this.renderer.createElement('i');
        this.renderer.setAttribute(icon, 'class', 'fas fa-solid fa-x');
        //this.renderer.setAttribute(icon, 'size', 'sm');
        this.renderer.setStyle(icon, 'color', 'white');
        this.renderer.setStyle(icon, 'font-size', '0.5rem');

        this.renderer.appendChild(btn, icon); // Ajoute l'icône dans le bouton
      
        this.renderer.listen(btn, 'click', (event) => {
          event.stopPropagation();
          this.openModal(arg.event.id); // 🔥 Ouvre le modal
        });
      
        this.renderer.appendChild(btnWrapper, btn);
        this.renderer.appendChild(div, btnWrapper); // Ajout du bouton après le titre
      
        return { domNodes: [div] };
      }
      
    
  };
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  
  constructor(private rendezVousService: RdvService,private renderer: Renderer2) {}


  ngOnInit(): void { }

    ngAfterViewInit() {
      const calendarApi = this.calendarComponent.getApi();
      setTimeout(() => {
        calendarApi.updateSize();
      }, 1000);
    
      //const patientId = 'e30a30f7-37ec-4812-9b4d-020109796f67'; // À remplacer dynamiquement
      this.rendezVousService.getRendezVousByPatientId().subscribe((rdvs) => {
        console.log('liste rdv de l api', rdvs);
        
        this.events = rdvs.map(rdv => ({
          id: rdv.id,
          title: `Consultation avec Dr ${rdv.medecin.nom} ${rdv.medecin.prenom}.`,
          start: `${rdv.date_RDV}T${rdv.time_RDV}`,
          end: `${rdv.date_RDV}T${this.addDuration(rdv.time_RDV, 30)}`,
          color: rdv.etat === 'En attente' ? 'green' : 'red'
        }));
    
        console.log('events', this.events);
    
        // Mettre à jour FullCalendar manuellement
        calendarApi.removeAllEvents();
        this.events.forEach(event => {
          calendarApi.addEvent(event);
        });
      });
    }
    
  addDuration(time: string, minutes: number): string {
    let [hour, minute] = time.split(':').map(Number);
    let date = new Date();
    date.setHours(hour);
    date.setMinutes(minute + minutes);
    
    return date.toISOString().split('T')[1].substring(0, 5); // Format HH:MM
  }
  openModal(eventId: string) {
    this.eventIdToCancel = eventId;
    this.visible_modal = true;
  }
  closeModal() {
    this.visible_modal = false;
    this.eventIdToCancel = null;
  }

  confirmDelete() {
    if (this.eventIdToCancel !== null) {  // ✅ Vérifie si la valeur n'est pas null
      this.rendezVousService.deleteRendezVous(this.eventIdToCancel).subscribe(() => {
        console.log('Rendez-vous annulé avec succès !');
  
        // Supprimer l'événement du calendrier
        const calendarApi = this.calendarComponent.getApi();
        const event = calendarApi.getEventById(this.eventIdToCancel!);

        if (event) event.remove();
  
        // Fermer le modal
        this.closeModal();
        this.toastMessage.set('Annulation du rendez-vous avec succès.');
        this.toastType.set('success');
        this.visible.set(true);
      });
    }
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
    this.visible.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }
  
}
