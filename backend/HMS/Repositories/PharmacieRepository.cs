
using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class PharmacieRepository : IPharmacieRepository
    {
        private readonly ApplicationDbContext _context;

        public PharmacieRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Pharmacien?> GetByIdAsync(Guid id)
        {
            return await _context.Pharmaciens.FindAsync(id);
        }

        public async Task<IEnumerable<Pharmacien>> GetAll()
        {
            return await _context.Pharmaciens.ToListAsync();
        }

        public async Task Add(Pharmacien pharmacien)
        {
            await _context.Pharmaciens.AddAsync(pharmacien);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public Pharmacien GetById(Guid id)
        {
            return _context.Pharmaciens.FirstOrDefault(p => p.Id == id);
        }

        public void Update(Pharmacien pharmacien)
        {
            _context.Pharmaciens.Update(pharmacien);
        }
        

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Delete(Pharmacien pharmacien)
        {
            _context.Pharmaciens.Remove(pharmacien);
        }

        public async Task<Pharmacien> GetByIdentityUserIdAsync(string identityUserId)
        {
            return await _context.Pharmaciens.FirstOrDefaultAsync(m => m.IdentityUserId == identityUserId);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Pharmaciens.CountAsync();
        }
    }
}


