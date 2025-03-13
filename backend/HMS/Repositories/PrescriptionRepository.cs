using Microsoft.EntityFrameworkCore;
using HMS.Interfaces;
using HMS.Models;

namespace HMS.Repositories
{
    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly ApplicationDbContext _context;

        public PrescriptionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Prescription> AddPrescriptionAsync(Prescription prescription)
        {
            await _context.Prescriptions.AddAsync(prescription);
            await _context.SaveChangesAsync();
            return prescription;
        }

    }
}
