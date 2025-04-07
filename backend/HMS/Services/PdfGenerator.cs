using System;
using System.IO;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using HMS.Models;
using System.Text.Json;
using iText.Kernel.Colors;
using System.Collections.Generic;

public class PdfGenerator
{
    public static byte[] FillPrescriptionTemplate(Prescription prescription)
    {
        string templatePath = "wwwroot/Templates/prescriptionTemplate.pdf";

        using (MemoryStream ms = new MemoryStream())
        using (PdfReader reader = new PdfReader("Templates/prescriptionTemplate.pdf"))
        using (PdfWriter writer = new PdfWriter(ms))
        using (PdfDocument pdfDoc = new PdfDocument(reader, writer))
        {
            Document document = new Document(pdfDoc);
            var font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

            // Directly add content to the PDF by specifying the coordinates for each element

            
            // Patient & Doctor Information


            document.Add(new Paragraph($"Docteur: {prescription.Medecin?.Nom ?? "N/A"} {prescription.Medecin?.Prenom ?? "N/A"}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 730, 400)); // Position the Doctor's Name

            document.Add(new Paragraph($"Patient : {prescription.Patient?.Nom ?? "N/A"} {prescription.Patient?.Prenom ?? "N/A"}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 710, 400)); // Position the Patient's Name

            document.Add(new Paragraph($"Date: {DateTime.Now:yyyy-MM-dd}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 690, 400)); // Position the Date

            // Medications Section
            var cleanedJson = JsonSerializer.Deserialize<string>(prescription.ListeMed);
            List<MedicamentDTO> medications = JsonSerializer.Deserialize<List<MedicamentDTO>>(cleanedJson);

            string medsFormatted = string.Join("\n", medications.Select(m =>
                $"- {m.Nom}: {m.Dosage}, {m.Frequence} pendant {m.Duree} / {m.InstructionsSpeciales}"));

            // Medication List
            document.Add(new Paragraph("Médicaments:")
                .SetFont(font)
                .SetFontSize(14)
                .SetBold()
                .SetFixedPosition(70, 650, 400)); // Position the "Medications" title

            document.Add(new Paragraph(medsFormatted)
                .SetFont(font)
                .SetFontSize(14)
                .SetFixedPosition(80, 600, 400)); // Position the medications list

            // Notes Section
            document.Add(new Paragraph("Notes:")
                .SetFont(font)
                .SetFontSize(14)
                .SetBold()
                .SetFixedPosition(40, 200, 400)); // Position the "Notes" title

            document.Add(new Paragraph(prescription.Note ?? "")
                .SetFont(font)
                .SetFontSize(12)
                .SetFixedPosition(40, 150, 400)); // Position the notes content

            // Doctor's Signature Line
            document.Add(new Paragraph("\n\nSignature: __________________")
                .SetFont(font)
                .SetFontSize(12)
                .SetFixedPosition(400, 150, 400)); // Position the signature line

            //tel
            document.Add(new Paragraph("12345678")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)  // Set font color to white
                .SetFixedPosition(100, 50, 400));
            //mail
            document.Add(new Paragraph("smartmed@gmail.com")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(100, 20, 400)); 
            //localisation
            document.Add(new Paragraph("16 Tunis, Tunis, Tunisie")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(260, 50, 400)); 
            //site web
            document.Add(new Paragraph("smart-med.tn")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(260, 20, 400)); 

            pdfDoc.Close();
            return ms.ToArray();
        }
    }
}
