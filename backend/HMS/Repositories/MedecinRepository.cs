using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace HMS.Repositories
{
    public class MedecinRepository : IMedecinRepository
    {
        private readonly ApplicationDbContext _context;

        public MedecinRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Medecin?> GetByIdAsync(Guid id)
        {
            return await _context.Medecins.FindAsync(id);
        }

        public async Task<IEnumerable<Medecin>> GetAll()
        {
            return await _context.Medecins.ToListAsync();
        }

        public async Task Add(Medecin medecin)
        {
            await _context.Medecins.AddAsync(medecin);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Medecin> GetByIdentityUserIdAsync(string identityUserId)
        {
            return await _context.Medecins.FirstOrDefaultAsync(m => m.IdentityUserId == identityUserId);
        }

        public Medecin GetById(Guid id)
        {
            return _context.Medecins.FirstOrDefault(m => m.Id == id);
        }

        public void Update(Medecin medecin)
        {
            _context.Medecins.Update(medecin);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Delete(Medecin medecin)
        {
            _context.Medecins.Remove(medecin);
        }
        public async Task<int> CountAsync()
        {
            return await _context.Medecins.CountAsync();
        }

    }
}
