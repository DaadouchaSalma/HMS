using HMS.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
    
{
    [Route("api/rendezvous")]
    [ApiController]
    public class RdvController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RdvController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("notifications/{patientId}")]
        public async Task<ActionResult<List<string>>> GetNotifications(Guid patientId)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Now);
            TimeOnly nowTime = TimeOnly.FromDateTime(DateTime.Now);

            var notifications = await _context.Rdv
                .Include(r => r.Medecin)
                .Where(r =>
                    r.etat == "En attente" &&
                    r.PatientId == patientId &&
                    r.Date_RDV >= today &&
                    (r.Date_RDV > today || r.Time_RDV > nowTime)
                )
                .Select(r => $"Rendez-vous avec Dr. {r.Medecin.Nom} le {r.Date_RDV} à {r.Time_RDV}.")
                .ToListAsync();

            return Ok(notifications);
        }
    }
}

