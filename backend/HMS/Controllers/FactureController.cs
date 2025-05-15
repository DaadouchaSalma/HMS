using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactureController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPatientRepository _patientRepository;

        public FactureController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IPatientRepository patientRepository)
        {
            _context = context;
            _userManager = userManager;
            _patientRepository = patientRepository;
        }

        [HttpGet("me")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<Facture>>> GetAllFacturesForPatient()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié" });
            }


            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
            {
                return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
            }
            var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
            if (patient == null)
            {
                return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
            }
            var factures = await _context.Factures
                .Include(f => f.Patient)
                .Include(f => f.Admission)
                .Where(f => f.PatientId == patient.Id)
                .ToListAsync();

            return Ok(factures);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Facture>>> GetAllFactures()
        {
                       var factures = await _context.Factures
                .Include(f => f.Patient)
                .Include(f => f.Admission)
                .ToListAsync();

            return Ok(factures);
        }
    }
}
