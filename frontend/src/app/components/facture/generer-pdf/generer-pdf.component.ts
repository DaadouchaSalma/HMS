import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import pdfMake from '../../../pdfwrapper'; 
import { Facture } from '../../../models/facture.model';
import { MedicamentFactureDetail } from '../../../models/medicamentFactureDetail.model';


@Component({
  selector: 'app-generer-pdf',
  imports: [],
  templateUrl: './generer-pdf.component.html',
  styleUrl: './generer-pdf.component.scss'
})
export class GenererPdfComponent {

constructor(private http: HttpClient) {}

  generatePDF(factureId: string): void {
    this.http.post<Facture>(`http://localhost:5160/api/facture/generer/${factureId}`, {}).subscribe({
      next: (facture) => {
        console.log(facture)
        const docDefinition = this.buildDocDefinition(facture);
        pdfMake.createPdf(docDefinition).open();
      },
      error: (err) => {
        console.error('Erreur lors de la génération de la facture :', err);
      }
    });
  }

 private buildDocDefinition(facture: Facture): any {
  const medicamentRows = facture.medicamentsDetails.map((med: MedicamentFactureDetail) => [
    { text: med.nom.toUpperCase(), fontSize: 10 },
    { text: med.prixUnitaire.toFixed(2)  , alignment: 'center', fontSize: 10 },
    { text: med.quantite.toString(), alignment: 'center', fontSize: 10 },
    { text: (med.quantite * med.prixUnitaire).toFixed(2) , alignment: 'center', fontSize: 10 }
  ]);

  return {
    pageMargins: [40, 60, 40, 100],
    content: [
      // Header
      {
        columns: [
          {
            width: '*',
            stack: [
              {
                image: 'data:image/png;base64,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', 
                width: 120,
                height: 60,
                margin: [0, -25, 0, 10],
              },
              { text: '\n' },
               { text: 'FACTURE', style: 'header' },
            ]
          },
          {
            width: 'auto',
            stack: [
              
              {
  text: [
    { text: 'Date : ', bold: true },
    { text: new Date(facture.dateFacture).toLocaleDateString() }
  ],
  style: 'smallText',
  alignment: 'left'
},
{
  text: [
    { text: 'Facture N° : ', bold: true },
    { text: facture.id.substring(0, 8).toUpperCase() }
  ],
  style: 'smallText',
  alignment: 'left'
}

            ]
          }
        ]
      },

      { text: '\n' },

      // Section patient / émetteur
      {
        columns: [
          {
  width: '50%',
  stack: [
    { text: 'Coordonnées de l\'hôpital', style: 'sectionTitle' },
    { text: 'SmartCare', style: 'info' },
    {
      text: [
        { text: 'Matricule Fiscal : ', bold: true },
        { text: '123456789' }
      ],
      style: 'info'
    },
    {
      text: [
        { text: 'Adresse : ', bold: true },
        { text: 'Rue des soins, Tunis' }
      ],
      style: 'info'
    }
  ]
},

          {
            width: '50%',
            stack: [
              { text: 'Patient', style: 'sectionTitle' },
              {
      width: '50%',
      text: facture.patient
        ? `${facture.patient.nom} ${facture.patient.prenom}`
        : 'Information patient indisponible',
      style: 'info'
    },
    {
      width: '50%',
      text: [
        { text: 'Email : ', bold: true },
        { text: facture.patient?.email || 'N/A' },
        { text: '\nN°Téléphone : ', bold: true },
        { text: facture.patient?.telephone || 'N/A' }
      ],
      style: 'info'
    }
            ]
          }
        ]
      },

      { text: '\n\n' },
      {
  text: 'DÉTAILS DE LA CHAMBRE',
  style: 'sectionTitle',
  margin: [0, 20, 0, 8]
},
{
  style: 'infoTable',
  table: {
    widths: ['*', '*'],
    body: [
      ['Numéro de chambre :', facture.admission?.chambre.numeroChambre],
      ['Étage :', facture.admission?.chambre.etage],
      ['Niveau d\'équipement :', facture.admission?.chambre.niveau_dequipement],
      ['Services :', facture.admission?.chambre.services],
      ['Nombre de lits :', facture.admission?.chambre.nb_lit]
    ],     
  },
  layout: 'lightHorizontalLines'
},
{ text: '\n\n' },

      // Tableau des médicaments et prestations
      {
        text: 'DÉTAILS DES MEDICAMENTS',
        style: 'sectionTitle'
      },

      {
        table: {
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Désignation', style: 'tableHeader' },
              { text: 'PU (TND)', style: 'tableHeader' },
              { text: 'Qté', style: 'tableHeader' },
              { text: 'Montant (TND)', style: 'tableHeader' }
            ],
            ...medicamentRows,
            
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 20]
      },
      

      // Totaux
      {
        columns: [
          { width: '*', text: '' },
          {
            width: '40%',
            table: {
              widths: ['*', 'auto'],
              body: [
                ['Total Médicaments :', facture.totalMedicaments.toFixed(2) + ' TND'],
                ['Total Chambre :', facture.totalChambre.toFixed(2) + ' TND'],
                [{ text: 'TOTAL TTC :', bold: true }, { text: facture.totalGeneral.toFixed(2) + ' TND', bold: true }]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ]
      },

      { text: '\n' },
      
      

      
    ],
    footer: function () {
  return {
    margin: [40, 20, 40, 40],
    fontSize: 8,
    layout: 'noBorders',
    stack: [
      {
        text: 'Merci pour votre confiance. Pour toute réclamation, veuillez nous contacter dans un délai de 7 jours.',
        alignment: 'center',
        italics: true,
        fontSize: 9,
        margin: [0, 0, 0, 10]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 0.5,
            lineColor: '#cccccc'
          }
        ]
      },
      {
        columns: [
          
          {
            width: '*',
            stack: [
              { text: 'SmartCare', bold: true, fontSize: 9 },
              { text: 'Rue des soins, Tunis' },
              { text: 'Tél : +216 70 000 000' },
              { text: 'Email : smartcare314@gmail.com' }
            ],
            alignment: 'left',
            margin: [0, 5, 0, 0]
          },
          {
            width: 'auto',
            text: `Page ${1} / ${1}`,
            alignment: 'right',
            margin: [0, 5, 0, 0]
          }
        ]
      },
      
    ]
  };
},

    styles: {
      clinicName: { fontSize: 14, bold: true, color: '#6387c0 ' },
      header: { fontSize: 22, bold: true, color: '#6387c0 ' },
      smallText: { fontSize: 10 },
      info: { fontSize: 11, margin: [0, 1, 0, 1] },
     
      sectionTitle: { fontSize: 12, bold: true, decoration: 'underline', margin: [0, 5, 0, 5] },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#a0b5d8',
        color: 'white',
        alignment: 'center'
      },
      footer: {
        fontSize: 9,
        italics: true,
        alignment: 'center',
        margin: [0, 30, 0, 0],
        color: '#555'
      }
    },
    defaultStyle: {
       font: 'Roboto'
    },
    sectionHeader: {
  fontSize: 14,
  bold: true,
  color: '#6387c0',
  decoration: 'underline'
},
infoTable: {
  fontSize: 10,
  margin: [0, 5, 0, 15]
}

  };
}


}