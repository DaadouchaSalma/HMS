using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PersonnelAdministrative?> GetByIdAsync(Guid id)
        {
            return await _context.Admins.FindAsync(id);
        }

        public async Task<IEnumerable<PersonnelAdministrative>> GetAll()
        {
            return await _context.Admins.ToListAsync();
        }

        public async Task Add(PersonnelAdministrative personnelAdministrative)
        {
            await _context.Admins.AddAsync(personnelAdministrative);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public PersonnelAdministrative GetById(Guid id)
        {
            return _context.Admins.FirstOrDefault(p => p.Id == id);
        }

        public void Update(PersonnelAdministrative personnelAdministrative)
        {
            _context.Admins.Update(personnelAdministrative);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Delete(PersonnelAdministrative personnelAdministrative)
        {
            _context.Admins.Remove(personnelAdministrative);
        }
    }
}

