import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarVisiteurComponent } from '../navbar-visiteur/navbar-visiteur.component';
import { FooterVisiteurComponent } from '../footer-visiteur/footer-visiteur.component';
import { Router } from '@angular/router';
import { ChatComponent } from '../../chatBot/chat/chat.component';

@Component({
  selector: 'app-actualite',
  imports: [FormsModule,CommonModule,NavbarVisiteurComponent,FooterVisiteurComponent,ChatComponent],
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ActualiteComponent {
  constructor(private router: Router) {}

goToActualite(id: number) {
  this.router.navigate(['/actualites', id]);
}

categories = ['Tout', 'Blog santé', 'Conférences', 'Prévention', 'Actions sociales'];
  selectedCategory = 'Tout';
  searchQuery = '';

  // Données mockées
  actualites = [
    {
      id: 1,
      title: "Nouveaux traitements contre le diabète",
      category: "Blog santé",
      excerpt: "Découvrez les dernières avancées médicales dans le traitement du diabète de type 2...",
      date: new Date('2023-11-15'),
      location: "En ligne",
      image: "/assets/images/interface/actualite_1.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Conférence annuelle de cardiologie",
      category: "Conférences",
      excerpt: "Les meilleurs cardiologues du pays se réunissent pour partager leurs connaissances...",
      date: new Date('2023-12-05'),
      location: "Hôtel Sheraton, Tunis",
      image: "/assets/images/interface/actualite_2.jpg",
      featured: false
    },
    {
      id: 3,
      title: "Campagne de vaccination gratuite",
      category: "Prévention",
      excerpt: "Vaccination contre la grippe saisonnière du 20 au 30 novembre dans tous les centres de santé...",
      date: new Date('2023-11-20'),
      location: "Tous les centres de santé",
      image: "/assets/images/interface/actualite_3.jpg",
      featured: true
    },
    {
      id: 4,
      title: "Collecte de sang d'urgence",
      category: "Actions sociales",
      excerpt: "Le centre national de transfusion sanguine lance un appel urgent aux dons de sang...",
      date: new Date('2023-11-25'),
      location: "Centre national de transfusion sanguine",
      image: "/assets/images/interface/actualite_4.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Atelier sur la nutrition saine",
      category: "Prévention",
      excerpt: "Apprenez à équilibrer votre alimentation pour une meilleure santé cardiovasculaire...",
      date: new Date('2023-12-10'),
      location: "Espace santé, Lac 1",
      image: "/assets/images/interface/actualite_5.jpg",
      featured: false
    }
  ];

  get filteredActualites() {
    return this.actualites.filter(item => {
      const matchesCategory = this.selectedCategory === 'Tout' || item.category === this.selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

}
