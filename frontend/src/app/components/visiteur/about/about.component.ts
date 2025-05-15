import { Component } from '@angular/core';
import { NavbarVisiteurComponent } from '../navbar-visiteur/navbar-visiteur.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FooterVisiteurComponent} from '../footer-visiteur/footer-visiteur.component';
import { ChatComponent } from '../../chatBot/chat/chat.component';


@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterModule, FormsModule,NavbarVisiteurComponent,FooterVisiteurComponent,ChatComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

features = [
  {
    title: 'Prise de rendez-vous en ligne',
    description: 'Réservez votre consultation en quelques clics, selon votre disponibilité, sans vous déplacer.',
    icon: '/assets/images/interface/rendez-vous.png'
  },
  {
    title: 'Paiement sécurisé via Stripe',
    description: 'Payez vos consultations en ligne de manière simple et sécurisée grâce à notre solution Stripe intégrée.',
    icon: '/assets/images/interface/paiement-securise.png'
  },
  {
    title: 'Notifications et rappels automatiques',
    description: 'Recevez des rappels automatiques par e-mail ou SMS pour ne jamais manquer vos rendez-vous médicaux.',
    icon: '/assets/images/interface/notification.png'
  },
  {
    title: 'Réclamations en ligne',
    description: 'Un souci ? Envoyez votre réclamation directement depuis votre espace personnel. On vous répond rapidement.',
    icon: '/assets/images/interface/assurance.png'
  },
  /*{
    title: 'Téléchargement d’analyses & factures',
    description: 'Accédez à vos résultats médicaux et vos factures en PDF, à tout moment, depuis votre compte.',
    icon: '/assets/images/interface/assurance.png'
  }*/
];

}
