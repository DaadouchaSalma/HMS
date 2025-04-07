using Microsoft.EntityFrameworkCore;
using HMS.Interfaces;
using HMS.Models;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

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

        public async Task<Prescription> GetPrescriptionByIdAsync(Guid id)
        {
            return await _context.Prescriptions
                .Include(p => p.Medecin)  // Include doctor details if needed
                .Include(p => p.Patient)  // Include patient details if needed
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
