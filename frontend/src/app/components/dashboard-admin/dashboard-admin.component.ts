import { Component, OnInit, ViewChild, signal, WritableSignal, effect } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartComponent } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Chambre } from '../../models/chambre.model';
import { MonthlyMeds } from '../../models/monthlyMeds.model';
import { ChambreService } from '../../services/services/chambre.service';
import { ReclamationService } from '../../services/reclamation.service';
import { MedecinService } from '../../services/medecin.service';
import { PharmacienService } from '../../services/pharmacien.service';
import { PersonnelAdminService } from '../../services/personnel-admin.service';
import { PatientService } from '../../services/patient.service';
import { PanierService } from '../../services/panier.service';




import { getStyle } from '@coreui/utils';
import { CardModule, ColComponent, RowComponent, WidgetStatDComponent } from '@coreui/angular-pro';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ProgressComponent, WidgetStatCComponent } from '@coreui/angular-pro';
import {TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular-pro';
import { IconDirective } from '@coreui/icons-angular';
import { TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ProgressBarDirective, CardGroupComponent } from '@coreui/angular-pro';
import {
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Chart, ChartTypeRegistry } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type?: ChartType;
  legend?: any;
}



@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule, 
    BaseChartDirective,
    CardModule, 
    ColComponent, 
    RowComponent,
    WidgetStatDComponent,
    ChartjsComponent,
    WidgetStatCComponent,
    TemplateIdDirective,
    IconDirective,
    ProgressComponent,
    CardComponent,
    CardGroupComponent
    
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  public bubbleChartType: ChartType = 'bubble';
  @ViewChild('bubbleChart') bubbleChart?: BaseChartDirective;

  public barChartPlugins = [ChartDataLabels];

  // Doughnut Chart
  @ViewChild('doughnutChart') doughnutChart?: BaseChartDirective;
  public doughnutChartLabels: string[] = ['Occupée', 'Disponible', 'En maintenance'];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#854d82d6', '#a0b5d8', '#3E608C'],
      hoverBackgroundColor: ['#854d82d6', '#a0b5d8', '#3E608C']
    }]
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: { enabled: true }
    },
    cutout: '60%'
  };
  public doughnutChartType: ChartType = 'doughnut';

  // Bar Chart
  @ViewChild('barChart') barChart?: BaseChartDirective;
  public reclamationChart: any = {};
  readonly #reclamationChartRef: WritableSignal<any> = signal(undefined);
  medecinCount: number = 0;
  PharmacienCount: number = 0;
  AdminiCount: number = 0;

  medsChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

medsChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const datasetLabel = context.dataset.label || '';
          const dataIndex = context.dataIndex;
          const monthlyData = this.monthlyMedsData[dataIndex]; // Assuming you store the raw data
          
          if (datasetLabel.includes('Validés')) {
            return [
              `${datasetLabel}: ${context.parsed.y}`,
              `1ère catégorie: ${monthlyData.topValidatedCategory}`
            ];
          } else {
            return [
              `${datasetLabel}: ${context.parsed.y}`,
              `1ère catégorie: ${monthlyData.topMissingCategory}`
            ];
          }
        },
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Mois'
      },
      ticks: {
        callback: (value, index) => {
          const rawMonth = this.monthlyMedsData[index]?.month;
          if (!rawMonth) return value;

          const date = new Date(`${rawMonth}-01`);
          return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
        }
      }
    },
    y: {
      title: {
        display: true,
        text: 'Nombre des médicaments'
      },
      beginAtZero: true,
      ticks: {
        precision: 0 // Show whole numbers only
      }
    }
  }
};

// Doctor by Service Chart Variables
@ViewChild('doctorServiceChart') doctorServiceChart?: BaseChartDirective;
doctorServiceChartData: ChartData<'bar'> = {
  labels: [],
  datasets: []
};

doctorServiceChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
    padding: {
      top: 22  // Add padding at the top of the chart
    }
  },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} médecins`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#495057', // Fallback color if CSS var fails
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value: number) => {
          return value.toString();
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#495057' // Fallback color
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          display: false
        },
        display: false
      }
    }
  };

  

  constructor(
    private chambreService: ChambreService,
    private reclamationService: ReclamationService,
    private medecinService : MedecinService,
    private pharmacienService : PharmacienService,
    private personnelAdminService : PersonnelAdminService,
    private patientService : PatientService,
    private panierService : PanierService

  ) {
    effect(() => {
      if (this.#reclamationChartRef()) {
        this.updateChartColors();
      }
    });
  }

ngOnInit(): void {
  this.loadChambreData();
  this.loadReclamationData();
  this.loadPatientData();
  this.loadMedicationData();
  this.loadDoctorServiceData();

  this.medecinService.getMedecinCount().subscribe({
    next: (count) => {
      this.medecinCount = count;
      this.calculateTotalPersonnel();
    }
  });

  this.pharmacienService.getPharmacienCount().subscribe({
    next: (count) => {
      this.PharmacienCount = count;
      this.calculateTotalPersonnel();
    }
  });

  this.personnelAdminService.getAdminCount().subscribe({
    next: (count) => {
      this.AdminiCount = count;
      this.calculateTotalPersonnel();
    }
  });
}

totalPersonnelCount: number = 0;
medecinPercentage: number = 0;
pharmacienPercentage: number = 0;
adminPercentage: number = 0;

private calculateTotalPersonnel(): void {
  this.totalPersonnelCount = this.medecinCount + this.PharmacienCount + this.AdminiCount;
  if (this.totalPersonnelCount > 0) {
    this.medecinPercentage = Math.round((this.medecinCount / this.totalPersonnelCount) * 100);
    this.pharmacienPercentage = Math.round((this.PharmacienCount / this.totalPersonnelCount) * 100);
    this.adminPercentage = Math.round((this.AdminiCount / this.totalPersonnelCount) * 100);

  }
}

getWidgetValueColor(val: number): string {
  if (val === 1) {
    return 'red';
  } else {
    return 'black';
  }
}


fetchMedecinCount(): void {
    this.medecinService.getMedecinCount().subscribe({
      next: (count) => {
        this.medecinCount = count;
        console.log("ddddddddddddddddddddddddddddddd",count)
      },
      error: (err) => {
        console.error('Error fetching medecin count', err);
      }
    });
  }

  private loadChambreData(): void {
    this.chambreService.GetChambres().subscribe((chambres: Chambre[]) => {
      let occupee = 0;
      let disponible = 0;
      let enMaintenance = 0;

      chambres.forEach(chambre => {
        const statut = chambre.statut.toLowerCase();
        if (statut.includes('occup')) occupee++;
        else if (statut.includes('dispon')) disponible++;
        else if (statut.includes('maintenance')) enMaintenance++;
      });

      this.doughnutChartData.datasets[0].data = [occupee, disponible, enMaintenance];
      this.doughnutChart?.update();
    });
  }



  private countReclamationsByType(reclamations: any[]): {type: string, count: number}[] {
    const typeCounts: {[key: string]: number} = {};

    // Initialize all possible types with 0 count
    const typesProblemes = [
      'Plomberie', 
      'Électricité', 
      'Climatisation', 
      'Hygiène', 
      'Autre'
    ];

    typesProblemes.forEach(type => {
      typeCounts[type] = 0;
    });

    // Count actual occurrences
    reclamations.forEach(rec => {
      const type = rec.typeProbleme || 'Autre';
      if (typeCounts.hasOwnProperty(type)) {
        typeCounts[type]++;
      } else {
        typeCounts['Autre']++;
      }
    });

    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  }

private loadReclamationData(): void {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Get current year reclamations
  this.reclamationService.getAllReclamations().subscribe(reclamations => {
    const currentYearCounts = this.countReclamationsByType(
      reclamations.filter(rec => new Date(rec.dateSoumission).getFullYear() === currentYear)
    );
    
    // Get previous year reclamations
    const previousYearCounts = this.countReclamationsByType(
      reclamations.filter(rec => new Date(rec.dateSoumission).getFullYear() === previousYear)
    );

    this.initReclamationChart(currentYearCounts, previousYearCounts, currentYear, previousYear);
  });
}

private initReclamationChart(
  currentYearCounts: {type: string, count: number}[],
  previousYearCounts: {type: string, count: number}[],
  currentYear: number,
  previousYear: number
): void {
  const typeLabels = [
    { value: 'Plomberie', label: 'Plomberie' },
    { value: 'Électricité', label: 'Électricité' },
    { value: 'Climatisation', label: 'Climatisation' },
    { value: 'Hygiène', label: 'Hygiène' },
    { value: 'Autre', label: 'Autre' },
  ];

  // Prepare data for current year (purple)
  const currentYearData = typeLabels.map(t => {
    const found = currentYearCounts.find(c => c.type === t.value);
    return found ? found.count : 0;
  });

  // Prepare data for previous year (grey)
  const previousYearData = typeLabels.map(t => {
    const found = previousYearCounts.find(c => c.type === t.value);
    return found ? found.count : 0;
  });

  this.reclamationChart = {
    data: {
      labels: typeLabels.map(t => t.label),
      datasets: [
        {
          label: currentYear.toString(),
          backgroundColor: '#dd789c' , // Purple for current year
          borderRadius: 6,
          borderSkipped: false,
          data: currentYearData,
          barPercentage: 0.9,
          categoryPercentage: 0.4
        },
        {
          label: previousYear.toString(),
          backgroundColor: '#d7deed', // Grey for previous year
          borderRadius: 6,
          borderSkipped: false,
          data: previousYearData,
          barPercentage: 0.9,
          categoryPercentage: 0.4
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: getStyle('--cui-body-color'),
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              return `${label}: ${context.parsed.y} réclamations`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: getStyle('--cui-border-color-translucent'),
            display: false,
            drawTicks: false
          },
          ticks: {
            color: getStyle('--cui-body-color'),
            font: {
              size: 14
            },
            padding: 16
          }
        },
        y: {
          beginAtZero: true,
          border: {
            dash: [2, 4],
            display: false
          },
          grid: {
            color: getStyle('--cui-border-color-translucent')
          },
          ticks: {
            color: getStyle('--cui-body-color'),
            font: {
              size: 14
            },
            maxTicksLimit: 5,
            padding: 16,
            stepSize: Math.ceil(100 / 4)
          }
        }
      }
    }
  };
}



  handleChartRef($chartRef: any, chartName: string) {
    if ($chartRef && chartName === 'reclamation') {
      this.#reclamationChartRef.set($chartRef);
    }
  }

  updateChartColors() {
    if (this.#reclamationChartRef()) {
      setTimeout(() => {
        const scales = { ...this.#reclamationChartRef().options.scales };
        scales.x.grid.color = getStyle('--cui-border-color-translucent');
        scales.x.ticks.color = getStyle('--cui-body-color');
        scales.y.grid.color = getStyle('--cui-border-color-translucent');
        scales.y.ticks.color = getStyle('--cui-body-color');
        this.#reclamationChartRef().update();
      });
    }
  }




  bubbleData: ChartData = {
    datasets: []
  };

  // Color mapping for blood groups
  /*bloodGroupColors: Record<string, string> = {
    'O-': 'rgb(50, 205, 50)',
    'O+': 'rgb(255, 205, 86)',
    'A-': 'rgb(255, 159, 64)',
    'A+': 'rgb(255, 99, 132)',
    'B-': 'rgb(54, 162, 235)',
    'B+': 'rgb(75, 192, 192)',
    'AB-': 'rgb(201, 203, 207)',
    'AB+': 'rgb(153, 102, 255)',    
  };*/

  bloodGroupColors: Record<string, string> = {
    'O-': '#dd789c',
    'O+': '#832144',
    'A-': '#753f73d6',
    'A+': '#cba4c8',
    'B-': '#3E608C',
    'B+': '#3e4d8c',
    'AB-': '#3a6e76',
    'AB+': '#61a7b1',    
  };

  // Shape mapping for sexes
  sexShapes: Record<string, string> = {
    'M': 'circle',
    'F': 'triangle'
  };

loadPatientData(): void {
    this.patientService.getBubblePatients().subscribe({
      next: (patients) => {
        this.transformPatientData(patients);
        console.log(patients);
      },
      error: (err) => {
        console.error('Error loading patient data:', err);
      }
    });
  }

  transformPatientData(patients: any[]): void {
    // Clear previous data
    this.bubbleData.datasets = [];
    
    // Get unique blood groups
    const bloodGroups = [...new Set(patients.map(p => p.groupeSanguin))];
    
    bloodGroups.forEach(group => {
      const groupPatients = patients.filter(p => p.groupeSanguin === group);
      
      // Create datasets for each sex
      ['M', 'F'].forEach(sex => {
        const sexPatients = groupPatients.filter(p => p.sexe === sex);
        
        if (sexPatients.length > 0) {
          this.bubbleData.datasets.push({
            label: `${group} ${sex === 'M' ? 'Masculin' : 'Féminin'}`,
            data: sexPatients.map(p => {
              const y = this.getBloodGroupPosition(p.groupeSanguin);
              if (y === -1) return null; // skip invalid blood groups

              return {
                x: this.calculateAge(p.dateNaissance), // ✅ Use calculated age
                y,
                r: this.calculateBubbleSize(sexPatients.length)
              };
            }).filter(p => p !== null),

            backgroundColor: this.bloodGroupColors[group],
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            pointStyle: this.sexShapes[sex]
          });
        }
      });
    });
  }
  private getBloodGroupPosition(bloodGroup: string): number {
    const bloodGroupOrder = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return bloodGroupOrder.indexOf(bloodGroup);
  }

  private getBloodGroupLabel(value: number | string): string {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return typeof value === 'number' ? bloodGroups[value] || '' : value;
  }

 private calculateBubbleSize(count: number): number {
  // Scale more aggressively: base size 10, increase by 4 per count
  const baseSize = 8;
  const scale = 2; // increase more per patient in group
  return Math.min(40, Math.max(10, baseSize + count * scale));
}

private calculateAge(dateString: string): number {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}



  public bubbleChartOptions: ChartOptions<'bubble'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Âge'
        },
        min: 0,
        max: 100
      },
      y: {
        title: {
          display: true,
          text: 'Groupe Sanguin'
        },
        ticks: {
          callback: (value) => this.getBloodGroupLabel(value)
        }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const data = context.raw as any;
            return `${label}: Age ${data.x}`;
          }
        }
      }
    }
  };



monthlyMedsData: MonthlyMeds[] = []; // Store the raw API response

loadMedicationData(): void {
  this.panierService.getMedsPerMonth().subscribe({
    next: (data: MonthlyMeds[]) => {
      this.monthlyMedsData = data; // Store raw data
      this.transformMedicationData(data);
    }
  });
}

  transformMedicationData(monthlyData: MonthlyMeds[]): void {
    console.log('Raw API data:', monthlyData);
    // Extract month names (format: "Jan 2025", "Feb 2025", etc.)
    this.medsChartData.labels = monthlyData.map(item => {
      const [year, month] = item.month.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1)
        .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    this.medsChartData.datasets = [
      {
        label: 'Médicaments validés',
        data: monthlyData.map(item => item.validatedMedsCount),
        borderColor: '#8c9cc2 ',
        backgroundColor: 'rgba(140, 156, 194, 0.55)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Médicaments Manquants',
        data: monthlyData.map(item => item.missingMedsCount),
        borderColor: '#ad6780',
        backgroundColor: 'rgba(173, 103, 128, 0.5)',
        tension: 0.4,
        fill: true
      }
    ];
    console.log('Chart data after transform:', this.medsChartData);
  }


  handleChartRefMeds($chartRef: any) {
    if ($chartRef) {
      console.log('Chart reference:', $chartRef);
      // You can add dynamic updates here if needed
    }
  }


  private loadDoctorServiceData(): void {
  this.medecinService.getMedecinCountByService().subscribe({
    next: (serviceCounts) => {
      this.transformDoctorServiceData(serviceCounts);
    },
    error: (err) => {
      console.error('Error loading doctor service data:', err);
    }
  });
}

private transformDoctorServiceData(serviceCounts: { [key: string]: number }): void {
  // Sort services by count (descending) and filter out zeros
  const sortedServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0);

  this.doctorServiceChartData.labels = sortedServices.map(([service]) => service);
  
  this.doctorServiceChartData.datasets = [
    {
      label: 'Number of Doctors',
      data: sortedServices.map(([_, count]) => count),
      backgroundColor: sortedServices.map((_, index) => 
        this.getServiceColor(index)
      ),
      borderRadius: 4,
      borderSkipped: false,
      // Add these properties to make bars thinner
      barThickness: 20, // Fixed pixel width (adjust as needed)
      // OR use percentage-based approach:
      // categoryPercentage: 0.8, // Percentage of available width for categories
      // barPercentage: 0.5, // Percentage of category width for bars
    }
  ];
   setTimeout(() => {
    this.doctorServiceChart?.update();
  }, 0);

}

 

private getServiceColor(index: number): string {
  const colors = [
     '#dd789c',    // default color if undefined
    '#bf8b9e',
     '#cba4c8',
     '#3E608C',
    '#61a7b1',
    '#753f73d6',
    '#636f83'
  ];
  return colors[index % colors.length];
}
}