using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class DossierMRepository : IDossierMRepository
    {
        private readonly ApplicationDbContext _context;

        public DossierMRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DossierM> CreateDossierM(DossierM dossier)
        {
            if (dossier.matricule == 0)
            {
                Random rnd = new Random();
                dossier.matricule = rnd.Next(100000000, 999999999);
            }
            _context.Dossiers.Add(dossier);
            await _context.SaveChangesAsync();
            return dossier;
        }

        public async Task<DossierM> UpdateDossierM(Guid id, DossierM dossierUpdates)
        {
            var existingDossier = await _context.Dossiers.FindAsync(id);
            if (existingDossier == null)
            {
                return null;
            }

            // Append new data to existing lists without replacing them
            existingDossier.maladies_anterieures.AddRange(dossierUpdates.maladies_anterieures ?? new List<string>());
            existingDossier.maladies_familiaux.AddRange(dossierUpdates.maladies_familiaux ?? new List<string>());
            existingDossier.chirurgies.AddRange(dossierUpdates.chirurgies ?? new List<string>());
            existingDossier.allergies.AddRange(dossierUpdates.allergies ?? new List<string>());
            existingDossier.vaccinations.AddRange(dossierUpdates.vaccinations ?? new List<string>());
            existingDossier.contact_urg.AddRange(dossierUpdates.contact_urg ?? new List<string>());
            existingDossier.note.AddRange(dossierUpdates.note ?? new List<string>());
            //existingDossier.liste_analyse.AddRange(dossierUpdates.liste_analyse ?? new List<string>());
     



            _context.Dossiers.Update(existingDossier);
            await _context.SaveChangesAsync();

            return existingDossier;
        }
    }
}

