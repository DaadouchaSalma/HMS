using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class FactureRepository : IFactureRepository
    {
        private readonly ApplicationDbContext _context;

        public FactureRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /*public async Task<Admission?> GetAdmissionAvecChambreAsync(Guid patientId)
        {
            return await _context.Admissions
                .Include(a => a.Chambre)
                .FirstOrDefaultAsync(a => a.PatientId == patientId && a.DateSortie != null);
            
        }*/

        public async Task<List<Panier>> GetPaniersValidésAsync(Guid patientId, DateTime dateDebut, DateTime dateFin)
        {
            return await _context.Paniers
                .Include(p => p.medPaniers)
                    .ThenInclude(mp => mp.Medicament)
                .Where(p => p.PatientId == patientId &&
                            p.DateValidation >= dateDebut &&
                            p.DateValidation <= dateFin &&
                            p.state == "valide")
                .ToListAsync();
        }

        public async Task AjouterFactureAsync(Facture facture)
        {
            await _context.Factures.AddAsync(facture);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<Patient?> GetPatientByIdAsync(Guid patientId)
        {
            return await _context.Patients.FindAsync(patientId);
        }
    }

}
