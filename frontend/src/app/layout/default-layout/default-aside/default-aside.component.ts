import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { RouterLink } from '@angular/router';
import {
  AvatarComponent,
  BorderDirective,
  ButtonCloseDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  ProgressBarDirective,
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarToggleDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective,
  ThemeDirective,
  BadgeComponent,
  ButtonDirective,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormControlDirective,
  FormDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  AlertComponent,
} from '@coreui/angular-pro';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ColComponent, ColDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ProgressComponent, RowDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular-pro';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { DatePickerComponent as DatePickerComponent_1 } from '@coreui/angular-pro';
import { ActivatedRoute } from '@angular/router';
import { cilCheck } from '@coreui/icons';

@Component({
    selector: 'app-default-aside',
    templateUrl: './default-aside.component.html',
    styleUrls: ['./default-aside.component.scss'],
    imports: [AlertComponent, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, RouterLink, NgTemplateOutlet, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormDirective, SidebarComponent, SidebarHeaderComponent, RouterLink, IconDirective, ThemeDirective, ButtonCloseDirective, SidebarToggleDirective, NgTemplateOutlet, ListGroupDirective, ListGroupItemDirective, BorderDirective, TextColorDirective, AvatarComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ProgressBarDirective, ProgressComponent, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, CommonModule, ButtonModule, FormsModule, ColDirective, RowDirective, FormSelectDirective, ColComponent, ReactiveFormsModule, FormFeedbackComponent, FormLabelDirective, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastBodyComponent, ProgressComponent, DatePickerComponent_1],
  })
export class DefaultAsideComponent implements AfterViewInit {
  patient: Patient = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    grp_Sang: '',
    password: '',
    date_Naiss: '',
    telephone: '',
  };
  position = 'top-start';
  visible = signal(false);
  percentage = signal(0);
  toastMessage = signal(''); 
  toastType = signal('success');
  icons = { cilCheck };

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private patientService: PatientService, private route: ActivatedRoute) {
  }


  public messages = Array.from({ length: 5 }, (v, i) => i);

  ngAfterViewInit(): void {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'display');
  }
  ngOnInit(): void {
    this.loadPatient();
  }

  loadPatient() {
    this.patientService.getPatientById().subscribe({
      next: (data: Patient) => {
        this.patient = data;
        console.log("matricule: ", this.patient.dossierMedical?.matricule)
      },
      error: () => {
        this.toggleToast('Erreur.', 'error');
      },
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  onSubmit(form: NgForm) {
    const patient = {
      ...this.patient,
      date_Naiss: this.formatDate(new Date(this.patient.date_Naiss)),
    };

    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    if (this.patient.id) {
      this.patientService.updatePatient(patient).subscribe({
        next: () => this.toggleToast('Le patient a été mis à jour avec succès.', 'success'),
        error: (error) => { console.log(error); this.toggleToast('Échec de l\'ajout du patient. Veuillez réessayer.', 'error')},
      });
    }
  }

  toggleToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.visible.update((value) => !value);
    setTimeout(() => {
      this.visible.set(false);
    }, 3000);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }
}
