using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HMS.Repositories
{
    public class PersonnelRepository
    {
        private readonly ApplicationDbContext _context;

        public PersonnelRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> CountAsync()
        {
            return await _context.Personnels.CountAsync();
        }
    }
}
