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
using System.Linq;

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

            // Patient & Doctor Information
            document.Add(new Paragraph($"Docteur: {prescription.Medecin?.Nom ?? "N/A"} {prescription.Medecin?.Prenom ?? "N/A"}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 730, 400));

            document.Add(new Paragraph($"Patient : {prescription.Patient?.Nom ?? "N/A"} {prescription.Patient?.Prenom ?? "N/A"}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 710, 400));

            document.Add(new Paragraph($"Date: {DateTime.Now:yyyy-MM-dd}")
                .SetFont(font)
                .SetFontSize(12)
                .SetBold()
                .SetFixedPosition(40, 690, 400));

            // Deserialize and display medications with spacing
            var cleanedJson = JsonSerializer.Deserialize<string>(prescription.ListeMed);
            List<MedicamentDTO> medications = JsonSerializer.Deserialize<List<MedicamentDTO>>(cleanedJson);

            float startY = 600; // Starting Y position
            float lineHeight = 60; // Line spacing

            foreach (var m in medications)
            {
                string line = $"- {m.Nom}: {m.Dosage}, {m.Frequence} pendant {m.Duree} / {m.InstructionsSpeciales}";
                document.Add(new Paragraph(line)
                    .SetFont(font)
                    .SetFontSize(18)
                    .SetFixedPosition(40, startY, 500));
                startY -= lineHeight;
            }

            // Notes Section
            document.Add(new Paragraph("Notes:")
                .SetFont(font)
                .SetFontSize(14)
                .SetBold()
                .SetFixedPosition(40, 200, 400));

            document.Add(new Paragraph(prescription.Note ?? "")
                .SetFont(font)
                .SetFontSize(12)
                .SetFixedPosition(40, 150, 400));

            // Contact Info (in white font)
            document.Add(new Paragraph("12345678")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(100, 50, 400));

            document.Add(new Paragraph("smartcare314@gmail.com")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(100, 20, 400));

            document.Add(new Paragraph("16 Tunis, Tunis, Tunisie")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(290, 50, 400));

            document.Add(new Paragraph("smartCare.tn")
                .SetFont(font)
                .SetFontSize(12)
                .SetFontColor(ColorConstants.WHITE)
                .SetFixedPosition(290, 20, 400));

            pdfDoc.Close();
            return ms.ToArray();
        }
    }
}
