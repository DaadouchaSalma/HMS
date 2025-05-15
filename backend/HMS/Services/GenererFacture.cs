using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using System.IO;
using System.Diagnostics;
using Color = MigraDoc.DocumentObjectModel.Color;
using HMS.Models;


namespace HMS.Services
{
    public class GenererFacture
    {
        public byte[] GenererFacturePDF(Facture facture)
        {
            var document = new Document();
            DefineStyles(document);

            var section = document.AddSection();
            section.PageSetup.TopMargin = "1.5cm";
            section.PageSetup.BottomMargin = "1.5cm";

            // En-tête avec logo et informations
            var headerTable = section.AddTable();
            headerTable.AddColumn("8cm");
            headerTable.AddColumn("8cm");
            var headerRow = headerTable.AddRow();

            // Partie gauche - Logo et info hôpital
            var leftCell = headerRow.Cells[0];
            leftCell.AddParagraph("Hôpital SmartCare").Style = "HospitalTitle";
            leftCell.AddParagraph("123 Avenue de la Santé").Style = "HospitalInfo";
            leftCell.AddParagraph("Scpparo, Hokkaido").Style = "HospitalInfo";
            leftCell.AddParagraph("Tél: +123 456 789").Style = "HospitalInfo";

            // Partie droite - Info facture
            var rightCell = headerRow.Cells[1];
            rightCell.AddParagraph("FACTURE").Style = "FactureTitle";
            rightCell.AddParagraph($"N°: {facture.Id}").Style = "FactureInfo";
            rightCell.AddParagraph($"Date: {facture.DateFacture:dd/MM/yyyy}").Style = "FactureInfo";
            rightCell.AddParagraph($"Échéance: {facture.DateFacture:dd/MM/yyyy}").Style = "FactureInfo";

            // Ligne de séparation
            section.AddParagraph().AddLineBreak();
            var separator = section.AddParagraph();
            separator.Format.Borders.Top.Color = Color.FromRgb(43, 72, 101);
            separator.Format.Borders.Top.Width = 2;
            separator.Format.SpaceAfter = "1cm";

            // Informations patient
            var patientTable = section.AddTable();
            patientTable.AddColumn("8cm");
            patientTable.AddColumn("8cm");
            var patientRow = patientTable.AddRow();

            patientRow.Cells[0].AddParagraph("PATIENT").Style = "SectionTitle";
            patientRow.Cells[0].AddParagraph(facture.Patient.Nom).Style = "PatientInfo";
            patientRow.Cells[0].AddParagraph(facture.Patient.Prenom).Style = "PatientInfo";
            patientRow.Cells[0].AddParagraph(facture.Patient.Telephone.ToString()).Style = "PatientInfo";

            patientRow.Cells[1].AddParagraph("CHAMBRE").Style = "SectionTitle";
            patientRow.Cells[1].AddParagraph($"Numéro: {facture.Admission.Chambre.NumeroChambre}").Style = "ChambreInfo";
            patientRow.Cells[1].AddParagraph($"Type: {facture.Admission.Chambre.Niveau_dequipement}").Style = "ChambreInfo";
            patientRow.Cells[1].AddParagraph($"Prix/jour: {facture.TotalChambre} TND").Style = "ChambreInfo";

            section.AddParagraph().Format.SpaceAfter = "1.5cm";

            // Tableau des médicaments
            var medsTable = section.AddTable();
            medsTable.Style = "Table";
            medsTable.Format.LeftIndent = "-0.5cm";
            medsTable.Borders.Color = Color.FromRgb(221, 221, 221);
            medsTable.Borders.Width = 0.75;

            // Colonnes élargies
            medsTable.AddColumn("12cm"); // Description (+2cm)
            medsTable.AddColumn("6cm").Format.Alignment = ParagraphAlignment.Right; // Prix (+1cm)
            medsTable.AddColumn("6cm").Format.Alignment = ParagraphAlignment.Center; // Qty (+1cm)
            medsTable.AddColumn("6cm").Format.Alignment = ParagraphAlignment.Right; // Total (+1cm)

            // En-tête tableau
            var header = medsTable.AddRow();
            header.Shading.Color = Color.FromRgb(43, 72, 101);
            header.Cells[0].AddParagraph("DESCRIPTION").Style = "TableHeaderBig";
            header.Cells[1].AddParagraph("PRIX UNIT.").Style = "TableHeaderBig";
            header.Cells[2].AddParagraph("QUANTITÉ").Style = "TableHeaderBig";
            header.Cells[3].AddParagraph("TOTAL").Style = "TableHeaderBig";

            foreach (var med in facture.MedicamentsDetails)
            {
                var row = medsTable.AddRow();
                row.VerticalAlignment = VerticalAlignment.Center;
                row.Cells[0].AddParagraph(med.Nom).Style = "MedicamentNameBig";
                row.Cells[1].AddParagraph(med.PrixUnitaire > 0 ? $"{med.PrixUnitaire} TND" : "OFFERT");
                row.Cells[2].AddParagraph(med.Quantite.ToString());
                row.Cells[3].AddParagraph(med.Total > 0 ? $"{med.Total} TND" : "OFFERT");
            }

            // Espacement avant les totaux
            section.AddParagraph().Format.SpaceAfter = "2.5cm";

            // Section Totaux
            var totalsTable = section.AddTable();
            totalsTable.AddColumn("12cm");
            totalsTable.AddColumn("6cm");
            totalsTable.Rows.LeftIndent = "0";

            var totalRow = totalsTable.AddRow();
            totalRow.Cells[0].AddParagraph("Conditions de paiement :").Style = "ConditionsText";
            totalRow.Cells[0].AddParagraph("Paiement par virement bancaire sous 15 jours").Style = "ConditionsText";

            var totals = totalRow.Cells[1];
            totals.AddParagraph($"TOTAL HT: {facture.TotalGeneral} TND").Style = "TotalLabelBig";
            totals.AddParagraph($"TVA (20%): {200} TND").Style = "TotalLabelBig";
            totals.AddParagraph($"REMISE: {50} TND").Style = "TotalLabelBig";
            totals.AddParagraph($"TOTAL TTC: {facture.TotalGeneral} TND").Style = "TotalAmountBig";

            // Pied de page
            var footer = section.Footers.Primary;
            footer.AddParagraph().Format.SpaceBefore = "2cm";
            footer.AddParagraph("Merci pour votre confiance").Style = "FooterText";
            footer.AddParagraph("Hôpital SmartCare - Agrément n°123456789").Style = "FooterText";

            // Génération PDF
            var renderer = new PdfDocumentRenderer(true) { Document = document };
            renderer.RenderDocument();

            using var stream = new MemoryStream();
            renderer.PdfDocument.Save(stream, false);
            return stream.ToArray();
        }
        private void DefineStyles(Document document)
        {

            var style = document.Styles["Normal"];
        style.Font.Size = 11; // Taille de base augmentée
        style.Font.Color = Color.FromRgb(51, 51, 51);

        // Nouveaux styles pour le tableau
        var tableHeaderBig = document.Styles.AddStyle("TableHeaderBig", "Normal");
        tableHeaderBig.Font.Size = 12;
        tableHeaderBig.Font.Bold = true;
        tableHeaderBig.Font.Color = Colors.White;
        tableHeaderBig.ParagraphFormat.Alignment = ParagraphAlignment.Center;

        var medicamentNameBig = document.Styles.AddStyle("MedicamentNameBig", "Normal");
        medicamentNameBig.Font.Size = 11;

        var totalLabelBig = document.Styles.AddStyle("TotalLabelBig", "Normal");
        totalLabelBig.Font.Size = 12;
        totalLabelBig.Font.Bold = true;

        var totalAmountBig = document.Styles.AddStyle("TotalAmountBig", "TotalLabelBig");
        totalAmountBig.Font.Size = 14;
        totalAmountBig.Font.Color = Color.FromRgb(229, 62, 62);

            var footerText = document.Styles.AddStyle("FooterText", "Normal");
            footerText.Font.Size = 9;
            footerText.Font.Color = Color.FromRgb(150, 150, 150);
            footerText.ParagraphFormat.Alignment = ParagraphAlignment.Center;
        }
    }
}