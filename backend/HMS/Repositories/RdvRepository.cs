using HMS.Interfaces;
using HMS.Models;
using HMS.Services;
using Microsoft.EntityFrameworkCore;
using System;

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

        public async Task<IEnumerable<RendezVous>> GetAllAsync()
        {
            return await _context.Rdv.Include(r => r.Patient).Include(r => r.Medecin).ToListAsync();
        }

        public async Task<RendezVous> GetByIdAsync(Guid id)
        {
            return await _context.Rdv.Include(r => r.Patient).Include(r => r.Medecin).FirstOrDefaultAsync(r => r.Id == id);
        }

        /* public async Task<IEnumerable<RendezVous>> GetDisponibilitesAsync(Guid medecinId, DateOnly date, TimeOnly time)
         {
             return await _context.Rdv
                 .Where(r => r.MedecinId == medecinId && r.Date_RDV == date && r.Time_RDV == time)
                 .ToListAsync();
         }*/


        public async Task CheckAndSendFeedbackEmailsAsync()
        {
            //var oneHourAgo = DateTime.UtcNow.AddHours(-1);
            var halfHourAgo = TimeOnly.FromDateTime(DateTime.UtcNow.AddMinutes(-30));

            var pastAppointments = await _context.Rdv
                .Where(r => r.Time_RDV <= halfHourAgo && r.Date_RDV == DateOnly.FromDateTime(DateTime.Now) && r.etat == "En attente")
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

            // Si la date sélectionnée est aujourd'hui, on enlève les heures passées
            var dateAujourdhui = DateOnly.FromDateTime(DateTime.Now);
            if (dateRDV == dateAujourdhui)
            {
                var heureActuelle = TimeOnly.FromDateTime(DateTime.Now);
                heuresDisponibles = heuresDisponibles
                    .Where(h => h > heureActuelle)
                    .ToList();
            }

            return heuresDisponibles;
        }





        public async Task<RendezVous> AddAsync(RendezVous rendezVous)
        {
            _context.Rdv.Add(rendezVous);
            await _context.SaveChangesAsync();
            return rendezVous;
        }

        public async Task UpdateAsync(RendezVous rendezVous)
        {
            _context.Rdv.Update(rendezVous);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var rendezVous = await _context.Rdv.FindAsync(id);
            if (rendezVous != null)
            {
                _context.Rdv.Remove(rendezVous);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<RendezVous>> GetRendezVousByPatientIdAsync(Guid patientId)
        {
            return await _context.Rdv
                .Where(r => r.PatientId == patientId)
                .Include(r => r.Medecin) // Inclure les détails du médecin
                .ToListAsync();
        }

        public async Task<bool> ExistsRendezVousAsync(Guid patientId, Guid medecinId, DateOnly date)
        {
            return await _context.Rdv
                .AnyAsync(r => r.PatientId == patientId
                            && r.MedecinId == medecinId
                            && r.Date_RDV == date);
        }

        public async Task<List<RendezVous>> GetRendezVousByMedecinIdAsync(Guid medecinId)
        {
            return await _context.Rdv
                .Include(r => r.Patient) 
                .Where(r => r.MedecinId == medecinId)
                .ToListAsync();
        }


    }
}
