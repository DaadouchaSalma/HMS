using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using HMS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactureController : Controller
    {
        private readonly FactureService _factureService;
        private readonly GenererFacture _generateurPDF;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPatientRepository _patientRepository;

        public FactureController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IPatientRepository patientRepository, FactureService factureService)
        {
            _context = context;
            _userManager = userManager;
            _patientRepository = patientRepository;
            _factureService = factureService;
            _generateurPDF = new GenererFacture();
        }
        
        [HttpPost("generer/{factureId}")]
        public async Task<IActionResult> GenererFacture(Guid factureId)
        {
            /*try
            {
                var facture = await _factureService.GenererFactureAsync(patientId);
                /*var pdfBytes = _generateurPDF.GenererFacturePDF(facture);
                return File(pdfBytes, "application/pdf", "Facture.pdf");*/
            /*return Ok(facture);


        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }*/
            {
                var facture = await _context.Factures
                    .Include(f => f.Patient)
                    .Include(f => f.Admission).ThenInclude(a => a.Chambre)
                    .Include(f => f.MedicamentsDetails)
                    .FirstOrDefaultAsync(f => f.Id == factureId);

                if (facture == null)
                    return NotFound("Facture introuvable.");

                return Ok(facture);

            }
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


