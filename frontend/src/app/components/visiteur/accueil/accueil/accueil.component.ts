import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarVisiteurComponent } from '../../navbar-visiteur/navbar-visiteur.component';
import {FooterVisiteurComponent} from '../../footer-visiteur/footer-visiteur.component';
import { ChatComponent } from 'src/app/components/chatBot/chat/chat.component';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-accueil',
   imports: [CommonModule, RouterModule, FormsModule,NavbarVisiteurComponent,FooterVisiteurComponent,ChatComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
  animations: [
    trigger('iconHover', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.2)',
        filter: 'drop-shadow(0 0 8px #854d82)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class AccueilComponent {
  @Input() label: string = 'Regular Check-up';
   @ViewChild('track') track!: ElementRef;


  searchQuery = '';
  selectedDate = '';
  featuredDoctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialty: 'Cardiologist',
      qualification: 'MBS',
      image: 'assets/images/doctors/doctor1.jpg',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Sarah Smith',
      specialty: 'Neurologist',
      qualification: 'MD',
      image: 'assets/images/doctors/doctor2.jpg',
      available: true
    },
    {
      id: 3,
      name: 'Dr. Michael Johnson',
      specialty: 'Pediatrician',
      qualification: 'MBBS',
      image: 'assets/images/doctors/doctor3.jpg',
      available: false
    }
  ];

  searchDoctors() {
    // Implémentation de la recherche
    console.log('Searching for:', this.searchQuery, 'on', this.selectedDate);
  }
faqs = [
  {
    question: 'Comment puis-je consulter un médecin sans avoir de compte ?',
    answer: 'Un compte est nécessaire. Veuillez vous rendre à l’accueil pour qu’un membre du personnel vous en crée un.',
    open: false
  },
  {
    question: 'Quels sont les horaires d’ouverture ?',
    answer: 'Notre hôpital est ouvert du lundi au samedi, de 8h00 à 18h00. Fermé le dimanche.',
    open: false
  },
  {
    question: 'Proposez-vous des services d’urgence ?',
    answer: 'Oui, nous avons un service d’urgence disponible 24h/24 et 7j/7.',
    open: false
  },
  {
    question: 'Puis-je annuler ou déplacer un rendez-vous ?',
    answer: 'Oui, depuis votre espace patient ou en contactant le secrétariat au moins 24h à l’avance.',
    open: false
  },
  {
    question: 'Quels documents apporter lors de ma première visite ?',
    answer: 'Veuillez apporter une pièce d’identité, votre carte de sécurité sociale et vos anciens dossiers médicaux si possible.',
    open: false
  }
];

// Dans votre composant Angular
// Dans votre composant Angular (exemple d'icônes)
steps = [
  {
    title: 'Prenez rendez-vous',
    description: 'Choisissez votre créneau et confirmez en quelques clics.',
    icon: '/assets/images/interface/ajouter-un-evenement_2.png'
  },
  {
    title: 'Rappels automatiques',
    description: 'Recevez une notification avant votre rendez-vous.',
    icon: '/assets/images/interface/cloche.png'
  },
  {
    title: 'Liste d’attente',
    description: 'Inscrivez-vous et soyez alerté dès qu’un créneau se libère.',
    icon: '/assets/images/interface/sablier (1).png'
  },
  {
    title: 'Paiement sécurisé',
    description: 'Réglez vos consultations en ligne via Stripe.',
    icon: '/assets/images/interface/stripe.png'
  }
];

// Dans votre composant Angular
specialities = [
  { name: 'Chirurgie', icon: '/assets/images/interface/chirurgie.png' },
  { name: 'Cardiologie', icon: '/assets/images/interface/heartbeat.png' },
  { name: 'Pédiatrie', icon: '/assets/images/interface/pediatrie.png' },
  { name: 'Gynécologie', icon: '/assets/images/interface/gynecologie.png' },
  { name: 'Neurologie', icon: '/assets/images/interface/neurologie.png' },
  { name: 'Psychiatrie', icon: '/assets/images/interface/mental-health.png' },
  { name: 'Orthopédie', icon: '/assets/images/interface/orthopedie.png' },
  { name: 'Dermatologie', icon: '/assets/images/interface/dermatologie.png' }
];

  toggle(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }


  duplicatedSpecialities = [...this.specialities, ...this.specialities, ...this.specialities];
  currentPosition = 0;
  cardWidth = 220; // Ajustez selon votre CSS
  autoScrollInterval: any;
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  ngAfterViewInit() {
    this.centerSlider();
    this.startAutoScroll();
    this.setupDragScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  centerSlider() {
    const middleSet = this.specialities.length;
    this.currentPosition = middleSet * this.cardWidth;
    this.updateSliderPosition();
  }

  scroll(direction: number) {
    this.stopAutoScroll();
    this.currentPosition += direction * this.cardWidth * 3; // Défile 3 cartes à la fois
    this.updateSliderPosition();
    this.startAutoScroll();
  }

  updateSliderPosition() {
    // Vérifie si on atteint le début ou la fin dupliqué
    const maxPosition = this.specialities.length * 2 * this.cardWidth;
    
    if (this.currentPosition >= maxPosition) {
      this.currentPosition = this.specialities.length * this.cardWidth;
    } else if (this.currentPosition <= 0) {
      this.currentPosition = this.specialities.length * this.cardWidth;
    }
    
    this.track.nativeElement.style.transform = `translateX(-${this.currentPosition}px)`;
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.currentPosition += this.cardWidth;
      this.updateSliderPosition();
    }, 3000);
  }

  stopAutoScroll() {
    clearInterval(this.autoScrollInterval);
  }

  setupDragScroll() {
    const track = this.track.nativeElement;

    track.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.startX = e.pageX - track.offsetLeft;
      this.scrollLeft = this.currentPosition;
      this.stopAutoScroll();
    });

    track.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.startAutoScroll();
      }
    });

    track.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.startAutoScroll();
      }
    });

    track.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.currentPosition = this.scrollLeft - walk;
      this.updateSliderPosition();
    });
  }

}
