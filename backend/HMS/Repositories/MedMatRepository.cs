using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class MedMatRepository : IMedMatRepository
    {
        private readonly ApplicationDbContext _context;
        public MedMatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Medicament? GetByName(string name)
        {
            return _context.Medicaments.FirstOrDefault(m => m.Nom == name && m.Nbr_stock > 0);
        }
    }
}
