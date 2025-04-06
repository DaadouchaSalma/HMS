using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;

        public PatientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Patient> GetByIdentityUserIdAsync(string identityUserId)
        {
            return await _context.Patients.Include(p => p.DossierMedical).FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);
        }
    }
}
