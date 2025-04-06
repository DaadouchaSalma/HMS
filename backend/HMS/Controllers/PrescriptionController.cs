using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using HMS.Interfaces;
using HMS.Repositories;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : Controller
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMedecinRepository _medecinRepository;

        public PrescriptionController(IPrescriptionRepository prescriptionRepository, UserManager<ApplicationUser> userManager, ApplicationDbContext context, IMedecinRepository medecinRepository)
        {
            _prescriptionRepository = prescriptionRepository;
            _userManager = userManager;
            _context = context;
            _medecinRepository = medecinRepository;
        }

        [Authorize(Roles = "Medecin")]
        [HttpPost("new")]
        public async Task<IActionResult> AddPrescription([FromBody] Prescription prescription)
        {

            if (prescription == null)
            {
                return BadRequest("Prescription data is required.");
            }

            try
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

                var medecin = await _medecinRepository.GetByIdentityUserIdAsync(identityUserId);
                if (medecin == null)
                {
                    return BadRequest(new { message = "Aucun medecin trouvé pour cet utilisateur." });
                }

                prescription.MedecinId = medecin.Id;
                prescription.ListeMed = JsonConvert.SerializeObject(prescription.ListeMed);
                await _prescriptionRepository.AddPrescriptionAsync(prescription);
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
