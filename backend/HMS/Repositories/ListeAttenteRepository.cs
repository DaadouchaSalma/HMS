using System.Drawing;
using HMS.Interfaces;
using HMS.Services;
using Humanizer;
using Microsoft.EntityFrameworkCore;

public class ListeAttenteRepository
{
    
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    public ListeAttenteRepository(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }
  
    public async Task<IEnumerable<ListeAttente>> GetPatientsEnAttenteByMedecinAndDate(Guid medecinId, DateOnly dateRDV)
    {
        return await _context.ListeAttentes
            .Where(x => x.MedecinId == medecinId && x.Date_RDV == dateRDV)
            .Include(x => x.Patient)  
            .ToListAsync();
    }
    public async Task DeletePatientsEnAttente(Guid medecinId, DateOnly dateRDV)
    {
        var patientsToDelete = await _context.ListeAttentes
            .Where(x => x.MedecinId == medecinId && x.Date_RDV == dateRDV)
            .ToListAsync();

        _context.ListeAttentes.RemoveRange(patientsToDelete);
        await _context.SaveChangesAsync();
    }

    public async Task NotifyPatientsInWaitingList(Guid medecinId, DateOnly dateRDV)
    {
        var patientsEnAttente = await _context.ListeAttentes
            .Where(x => x.MedecinId == medecinId && x.Date_RDV == dateRDV)
            .Include(x => x.Patient).Include(x => x.Medecin)
            .ToListAsync();

        foreach (var patientAttente in patientsEnAttente)
        {
            var emailSubject = "⚡ Un créneau de rendez-vous s'est libéré !";

            var emailBody = $@"
        <html lang='fr'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Rendez-vous disponible</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }}
                .container {{
                    width: 90%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #0073e6;
                    color: white;
                    padding: 15px;
                    font-size: 18px;
                    border-radius: 8px 8px 0 0;
                }}
                .content {{
                    padding: 20px;
                    color: #333;
                }}
                .cta {{
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #0073e6;
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-top: 15px;
                }}
                .cta:hover {{
                    background-color: #005bb5;
                }}
                .footer {{
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }}
               .ii a[href] {{color: #ffffff;}}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>🚀 Un créneau est disponible !</div>
                <div class='content'>
                    <p>Bonjour <strong>{patientAttente.Patient.Nom} {patientAttente.Patient.Prenom} </strong>,</p>
                    <p>Nous avons le plaisir de vous informer qu'un créneau avec votre médecin <strong> {patientAttente.Medecin.Nom} {patientAttente.Medecin.Prenom}</strong>  est maintenant disponible :</p>
                    <p><strong>📅 Date : {dateRDV}</strong></p>
                    <p>Nous vous invitons à confirmer votre rendez-vous dès que possible.</p>
                    <a href='http://localhost:4200/#/rendezvous/add-rdv' class='cta'>Confirmer mon rendez-vous</a>
                </div>
               <div class='signature'>
                            <p><strong>SmartCare</strong> - Votre santé, notre priorité.</p>
                            <p>📍 123 Avenue de la Santé, Tunis, Tunisie</p>
                            <p>📞 +216 71 345 678 | 📧 smartcare314@gmail.com</p>
                            
              </div>
                <div class='footer'>
                    <p>Ce message est généré automatiquement, merci de ne pas y répondre.</p>
                </div>
            </div>
             
        </body>
        </html>";

            await _emailService.SendEmailAsync_crenaux(patientAttente.Patient.Email, emailSubject, emailBody);

            // Remove from waiting list after notification
            _context.ListeAttentes.Remove(patientAttente);
        }

        await _context.SaveChangesAsync();
    }
    public async Task AjouterPatientAListeAttente(Guid patientId, Guid medecinId, DateOnly dateRDV)
    {
        var existingEntry = await _context.ListeAttentes
            .FirstOrDefaultAsync(x => x.PatientId == patientId && x.MedecinId == medecinId && x.Date_RDV == dateRDV);

        if (existingEntry == null)
        {
            var listeAttente = new ListeAttente
            {
                PatientId = patientId,
                MedecinId = medecinId,
                Date_RDV = dateRDV,
                DateAjout = DateTime.Now
            };

            _context.ListeAttentes.Add(listeAttente);
            await _context.SaveChangesAsync();
        }
    }
}
