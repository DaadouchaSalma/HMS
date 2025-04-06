using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class PatientRepository :IPatientRepository
    {
        private readonly ApplicationDbContext _context;

        public PatientRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Patient> GetByIdAsync(Guid id)
        {
            return await _context.Patients.FindAsync(id);
        }
        public async Task<Patient> GetByIdentityUserIdAsync(string identityUserId)
        {
            return await _context.Patients.FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);
        }


    }
}
