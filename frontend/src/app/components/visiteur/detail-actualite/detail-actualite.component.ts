import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-actualite',
  imports: [CommonModule,FormsModule],
  templateUrl: './detail-actualite.component.html',
  styleUrl: './detail-actualite.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('0.4s 0.2s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DetailActualiteComponent implements OnInit {
actualite: any;

  // Données mockées (en réalité vous utiliseriez un service)
  actualites = [
    {
      id: 1,
      title: "Nouveaux traitements contre le diabète",
      category: "Blog santé",
      content: `
        <p>Les dernières recherches médicales ont abouti à des avancées significatives dans le traitement du diabète de type 2. Une nouvelle classe de médicaments, les inhibiteurs de SGLT2, montre des résultats prometteurs.</p>
        
        <h3>Avantages principaux :</h3>
        <ul>
          <li>Réduction de 30% des risques cardiovasculaires</li>
          <li>Effets secondaires minimisés</li>
          <li>Administration orale simplifiée</li>
        </ul>
        
        <p>Le Dr. Ahmed Ben Salah, endocrinologue à l'Hôpital Charles Nicolle, commente : "Ces traitements révolutionnaires changent la vie de nos patients tout en réduisant la charge sur le système de santé."</p>
        
        <p>Ces médicaments seront disponibles dans les pharmacies agréées à partir du 15 janvier 2024.</p>
      `,
      date: new Date('2023-11-15'),
      location: "En ligne",
      image: "assets/images/blog1.jpg",
      author: "Dr. Leila Trabelsi",
      authorImage: "/assets/images/doctor1.jpg",
      featured: true,
      related: [2, 5]
    },
    // ... autres actualités (mêmes données que dans le composant précédent)
  ];

  relatedActualites: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.actualite = this.actualites.find(a => a.id === +id);
    
    if (this.actualite && this.actualite.related) {
      this.relatedActualites = this.actualites.filter(a => 
        this.actualite.related.includes(a.id)
      );
    }
  }

  shareOnSocial(platform: string) {
    // Implémentation basique du partage
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Je lis : ${this.actualite.title}`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  }
}
