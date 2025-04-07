import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, AlertComponent } from '@coreui/angular-pro';
import { LoginModel } from 'src/app/models/login.model';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { cilWarning } from '@coreui/icons';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, CommonModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, AlertComponent, IconDirective]
})
export class LoginComponent {

  loginData: LoginModel = { email: '', password: '' };
  errorMessage: string = '';
  icons = { cilWarning  };

  constructor(private authService: AuthService, private router: Router, private patientService: PatientService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
  
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        const roles: string[] = response.roles;
        localStorage.setItem('userRoles', JSON.stringify(roles));
        if (roles.includes('Patient')) {
            this.router.navigate(['/patient/list']);
        } else if (roles.includes('Medecin')) {
            this.router.navigate(['/patient/new']);
        } else if (roles.includes('Admin')) {
            this.router.navigate(['/dashboard']);
        } else {
          console.error('Unknown role, redirecting to default page');
          this.router.navigate(['/login']); 
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Identifiants incorrects';
      },
    });
  }  

}
