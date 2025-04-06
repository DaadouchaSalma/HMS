using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class RdvRepository : IRdvRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService; 

        public RdvRepository(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task CheckAndSendFeedbackEmailsAsync()
        {
            //var oneHourAgo = DateTime.UtcNow.AddHours(-1);
            var halfHourAgo = TimeOnly.FromDateTime(DateTime.UtcNow.AddMinutes(-30));

            var pastAppointments = await _context.Rdv
                .Where(r => r.Time_RDV <= halfHourAgo && r.etat == "En attente")
                .Include(r => r.Patient)
                .ToListAsync();

            foreach (var rdv in pastAppointments)
            {
                rdv.etat = "Terminée"; 

                if (rdv.Patient != null)
                {
                    await _emailService.SendEmailAsync(
                        rdv.Patient.Email,rdv.Patient.Nom
                    );
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<RendezVous> AddAsync(RendezVous rendezVous)
        {
            _context.Rdv.Add(rendezVous);
            await _context.SaveChangesAsync();
            return rendezVous;
        }

        /*public async Task<IEnumerable<RendezVous>> GetDisponibilitesAsync(Guid medecinId, DateTime date)
        {
            return await _context.Rdv
                .Where(r => r.MedecinId == medecinId && r.Date_RDV.Date == date.Date)
                .ToListAsync();
        }*/
        public async Task<List<TimeOnly>> GetHeuresDisponiblesAsync(Guid medecinId, DateOnly dateRDV)
        {
            // Récupérer tous les créneaux horaires possibles pour ce médecin
            var heuresOuverture = new List<TimeOnly>
            {
                new(8, 0),new(8,30), new(9, 0),new(9, 30), new(10, 0), new(10, 30), new(11, 0), new(11, 30),new(14, 0),new(14, 30), new(15, 0),new(15, 30), new(16, 0)
            };

            // Récupérer les rendez-vous déjà pris ce jour-là
            var rdvs = await _context.Rdv
                .Where(r => r.MedecinId == medecinId && r.Date_RDV == dateRDV)
                .Select(r => r.Time_RDV)
                .ToListAsync();

            // Filtrer les heures disponibles
            var heuresDisponibles = heuresOuverture.Except(rdvs).ToList();

            return heuresDisponibles;
        }

    }
}
