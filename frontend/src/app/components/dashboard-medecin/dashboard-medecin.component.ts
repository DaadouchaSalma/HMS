import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { RdvService } from '../../services/rdv.service';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CardModule, ColComponent, RowComponent } from '@coreui/angular-pro';
import { RendezVous } from '../../models/rdv.model';
import frLocale from '@fullcalendar/core/locales/fr';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ProgressComponent } from '@coreui/angular-pro';


@Component({
  selector: 'app-dashboard-medecin',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CardModule, ColComponent, ChartjsComponent, RowComponent,ProgressComponent],
  templateUrl: './dashboard-medecin.component.html',
  styleUrls: ['./dashboard-medecin.component.scss']
})
export class DashboardMedecinComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    editable: false,
    selectable: false, 
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'bootstrap5',
    locale: frLocale
  };

  public salesChart: any;
  public totalRDVs: number = 0;

  constructor(private rdvService: RdvService) {}

  ngOnInit(): void {
    this.rdvService.getRdvForMedecin().subscribe((rendezVousList: RendezVous[]) => {
      const events: EventInput[] = rendezVousList.map(rdv => ({
        title: `${rdv.patient?.nom ?? 'Inconnu'} ${rdv.patient?.prenom ?? ''}`,
        start: `${rdv.date_RDV}T${rdv.time_RDV}`,
        color: rdv.etat === 'En attente' ? 'orange' : 'green'
      }));

      this.calendarOptions.events = events;
      this.salesChart = this.generateSalesChart(rendezVousList);
      this.totalRDVs = rendezVousList.length;
      this.filterRendezVous(rendezVousList);
    });
  }
  public rdvBeforeNoon: RendezVous[] = [];
  public rdvAfterNoon: RendezVous[] = [];
  
  filterRendezVous(rdvs: RendezVous[]): void {
    this.rdvBeforeNoon = rdvs.filter(rdv => {
      const hour = parseInt(rdv.time_RDV?.split(':')[0], 10);
      return hour < 12;
    });
  
    this.rdvAfterNoon = rdvs.filter(rdv => {
      const hour = parseInt(rdv.time_RDV?.split(':')[0], 10);
      return hour >= 12;
    });
  }
  getMonthlyRDVCounts(rdvs: RendezVous[]): number[] {
    const counts = Array(12).fill(0);
    rdvs.forEach(rdv => {
      const date = new Date(rdv.date_RDV);
      const month = date.getMonth();
      counts[month]++;
    });
    return counts; 
  }

  generateSalesChart(rdvs: RendezVous[]): any {
    const monthlyCounts = this.getMonthlyRDVCounts(rdvs);
    const primaryRGB = getStyle('--cui-primary-rgb') || '0, 80, 255';
    const primaryColor = getStyle('--cui-primary') || '#0050ff';
  
    return {
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'RDV par mois',
            data: monthlyCounts,
            tension: 0.4,
            fill: true,
            backgroundColor: `rgba(${primaryRGB}, 0.1)`,
            borderColor: primaryColor,
            pointRadius: 5,               // <-- Bigger points
            pointHoverRadius: 7,         // <-- Bigger hover area
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }     // <-- Show tooltip on hover
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        elements: {
          line: { tension: 0.4 },
          point: {
            radius: 5,
            hoverRadius: 7
          }
        }
      }
    };
  }
  
}
