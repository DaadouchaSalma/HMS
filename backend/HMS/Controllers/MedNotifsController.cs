using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HMS.Models;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedNotifsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedNotifsController (ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedNotifs>>> GetMedNotifs()
        {

            return await _context.medNotifs.ToListAsync();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedNotif(Guid id)
        {
            var notif = await _context.medNotifs.FindAsync(id);
            if (notif == null)
            {
                return NotFound("notif not found.");
            }

            _context.medNotifs.Remove(notif);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
