using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace HMS.Repositories
{
    public class FournisseurRepository : IFournisseur
    {
        private readonly ApplicationDbContext _context;

        public FournisseurRepository(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Fournisseur>> GetAllAsync()
        {
            return await _context.fournisseurs
                .Include(f => f.Medicaments) // Include related Medicaments
                .ToListAsync();
        }

        public async Task<Fournisseur> GetByIdAsync(Guid id)
        {
            return await _context.fournisseurs
                .Include(f => f.Medicaments) 
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<Fournisseur> AddAsync(Fournisseur fournisseur)
        {
            _context.fournisseurs.Add(fournisseur);
            await _context.SaveChangesAsync();
            return fournisseur;
        }

        public async Task<Fournisseur> UpdateAsync(Fournisseur fournisseur)
        {
            _context.fournisseurs.Update(fournisseur);
            await _context.SaveChangesAsync();
            return fournisseur;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var fournisseur = await _context.fournisseurs.FindAsync(id);
            if (fournisseur == null) return false;

            _context.fournisseurs.Remove(fournisseur);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
