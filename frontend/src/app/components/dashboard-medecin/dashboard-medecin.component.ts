import { Component, OnInit, ViewChild ,Input} from '@angular/core';
import { CalendarOptions, EventInput,EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { RdvService } from '../../services/rdv.service';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CardModule, ColComponent, RowComponent,WidgetStatDComponent } from '@coreui/angular-pro';
import { RendezVous } from '../../models/rdv.model';
import frLocale from '@fullcalendar/core/locales/fr';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ProgressComponent, WidgetStatAComponent } from '@coreui/angular-pro';
import { Router } from '@angular/router';

import { IconDirective } from '@coreui/icons-angular';
import {TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular-pro';
import { ChartData } from 'chart.js';

type BrandData = {
  icon: string
  values: any[]
  capBg?: any
  color?: string
  labels?: string[]
  data: ChartData
}

@Component({
  selector: 'app-dashboard-medecin',
  standalone: true,
  imports: [CommonModule,IconDirective,TemplateIdDirective,WidgetStatDComponent, FullCalendarModule, CardModule, ColComponent, ChartjsComponent, RowComponent,ProgressComponent,WidgetStatAComponent,ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective ],
  templateUrl: './dashboard-medecin.component.html',
  styleUrls: ['./dashboard-medecin.component.scss']
})
export class DashboardMedecinComponent implements OnInit {
  
  today = new Date();
  todayStr: string = this.today.toISOString().replace(/T.*$/, '');

  constructor(private rdvService: RdvService,private router: Router) {}


  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialDate: this.todayStr,
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
    locale: frLocale,
    eventClick: this.handleEventClick.bind(this),
  };



  public salesChart: any;
  public totalRDVs: number = 0;
  morningRDVTotal: number = 0;
  eveningRDVTotal: number = 0;




  progressGroupExample1: {
    title: string;
    value1: number; // Morning
    value2: number; // Evening
  }[] = [];

tauxOccupationAujourdHui: number = 0;
nextRdvWidget: any = null;
brandData: any[] = [];

  ngOnInit(): void {
  this.rdvService.getRdvForMedecin().subscribe((rendezVousList: RendezVous[]) => {
    console.log(rendezVousList);
    const events: EventInput[] = rendezVousList.map(rdv => ({
      title: ` ${rdv.patient?.nom?.toUpperCase() ?? ''} ${rdv.patient?.prenom ?? ''}`,
      start: `${rdv.date_RDV}T${rdv.time_RDV}`,
      color: '#753f73c1',
      extendedProps: {
        patientId: rdv.patientId
      }
    }));

    

    this.calendarOptions.events = events;
    this.salesChart = this.generateSalesChart(rendezVousList);
    this.totalRDVs = rendezVousList.length;
    this.tauxOccupationAujourdHui = this.calculateTauxOccupationAujourdHui(rendezVousList, 13); 


    const morningCounts = this.getMorningRDVCountsLastWeek(rendezVousList);
    const eveningCounts = this.getEveningRDVCountsLastWeek(rendezVousList);

    this.morningRDVTotal = Object.values(morningCounts).reduce((a, b) => a + b, 0);
    this.eveningRDVTotal = Object.values(eveningCounts).reduce((a, b) => a + b, 0);
    this.brandData = [
  {
    icon: 'cilCalendar',
    values: [
      { title: 'Rendez-vous aujourd\'hui', value: this.getNombreRDVsAujourdHui(rendezVousList) },
      { title: 'Prochain Rendez-vous ', value: this.getNextRdv(rendezVousList)?.time_RDV }
    ],
    capBg: { '--cui-card-cap-bg': '#dd789c' },
    data: {
      labels: [...this.labels],
      datasets: [{
        ...this.datasets,
        data: this.getMonthlyRDVCounts(rendezVousList),
        label: 'RDV',
        ...this.colors
      }]
    }
  }
];
this.setChartData();

    this.progressGroupExample1 = Object.keys(morningCounts).map(dateStr => {
      const displayDate = new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
      return {
        title: displayDate,
        value1: morningCounts[dateStr],
        value2: eveningCounts[dateStr]
      };
    });
  });
}


handleEventClick(clickInfo: EventClickArg) {
  const patientId = clickInfo.event.extendedProps['patientId'];
  if (patientId) {
    this.router.navigate(['/dossierM/dossierMListeMedecin', patientId]);
  }
}

@Input() withCharts?: boolean;
  // @ts-ignore
  chartOptions = {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  datasets = {
    borderWidth: 2,
    fill: true
  };
  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };

  calculateTauxOccupationAujourdHui(rdvs: RendezVous[], totalSlots: number): number {
    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD
    const rdvsAujourdHui = rdvs.filter(rdv => rdv.date_RDV === today);
    const occupation = (rdvsAujourdHui.length / totalSlots) * 100;
    return Math.round(occupation); // rounded to nearest whole number
  }
getNombreRDVsAujourdHui(rdvs: RendezVous[]): number {
  const today = new Date().toLocaleDateString('en-CA'); // outputs YYYY-MM-DD
  const v = rdvs.filter(rdv => rdv.date_RDV === today).length;
  console.log("Today is:", today);
  console.log("Dates in RDVs:", rdvs.map(r => r.date_RDV));
  console.log("getNombreRDVsAujourdHui", v);
  return v;
}



  getNextRdv(rdvs: RendezVous[]): RendezVous | null {
    const now = new Date();

    const upcomingRdvs = rdvs
      .map(rdv => {
        const dateTimeStr = `${rdv.date_RDV}T${rdv.time_RDV}`;
        return { ...rdv, dateTime: new Date(dateTimeStr) };
      })
      .filter(rdv => rdv.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    return upcomingRdvs.length > 0 ? upcomingRdvs[0] : null;
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
    const primaryRGB = 'rgb(140, 156, 194)';
    const primaryColor = '#753f73d6';
  
    return {
      data: {
        labels: ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Jui', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'RDV par mois',
            data: monthlyCounts,
            tension: 0.4,
            fill: true,
            backgroundColor: `rgba(117, 63, 115, 0.43)`,
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
          tooltip: { enabled: true }     
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

  getMorningRDVCountsLastWeek(rdvs: RendezVous[]): { [date: string]: number } {
    const now = new Date();
    const result: { [date: string]: number } = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      result[dateStr] = 0;
    }


    rdvs.forEach(rdv => {
      const dateStr = rdv.date_RDV;
      const hour = parseInt(rdv.time_RDV.split(':')[0], 10);

      if (result.hasOwnProperty(dateStr) && hour < 12) {
        result[dateStr]++;
      }
    });
    console.log(result);


    return result;
  }

  getEveningRDVCountsLastWeek(rdvs: RendezVous[]): { [date: string]: number } {
    const now = new Date();
    const result: { [date: string]: number } = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      result[dateStr] = 0;
    }


    rdvs.forEach(rdv => {
      const dateStr = rdv.date_RDV;
      const hour = parseInt(rdv.time_RDV.split(':')[0], 10);

      if (result.hasOwnProperty(dateStr) && hour >= 12) {
        result[dateStr]++;
      }
    });

    return result;
  }


  labelsWidget = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
data: any[] = [];
options: any[] = [];

datasetsWidget = [[{
  label: 'My Third dataset',
  backgroundColor: 'rgba(255,255,255,.2)',
  borderColor: 'rgba(255,255,255,.55)',
  pointBackgroundColor: getStyle('--cui-warning'),
  pointHoverBorderColor: getStyle('--cui-warning'),
  data: [78, 81, 80, 45, 34, 12, 40],
  fill: true
}]];

optionsDefault = {
  plugins: {
    legend: {
      display: false
    }
  },
  maintainAspectRatio: false,
  scales: {
    x: { display: false },
    y: { display: false }
  },
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      radius: 0
    }
  }
};

setChartData() {
  this.data[2] = {
    labels: this.labelsWidget, // Make sure this matches the chart's expected labels
    datasets: this.datasetsWidget[0] // Make sure this is the correct format
  };
  this.options[2] = { 
    ...this.optionsDefault,
    // Add any chart-specific options here
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };
}

}
