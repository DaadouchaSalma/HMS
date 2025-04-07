using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace HMS.Repositories
{
    public class ReclamationRepository: IReclamationRepository
    {
        private readonly ApplicationDbContext _context;

        public ReclamationRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Reclamation>> GetAll()
        {
            return await _context.Reclamations.Include(r => r.Chambre).Include(r => r.Patient).ToListAsync();
        }
        public async Task<Reclamation> GetById(Guid id)
        {
            return await _context.Reclamations.Include(r => r.Chambre).FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task<IEnumerable<Reclamation>> GetByChambreId(Guid chambreId)
        {
            return await _context.Reclamations.Where(r => r.ChambreId == chambreId).ToListAsync();
        }
        public async Task<Reclamation> Add(Reclamation reclamation)
        {
            _context.Reclamations.Add(reclamation);
            await _context.SaveChangesAsync();
            return reclamation;
        }
        public async Task<bool> Delete(Guid id)
        {
            var reclamation = await _context.Reclamations.FindAsync(id);
            if (reclamation == null) return false;

            _context.Reclamations.Remove(reclamation);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
