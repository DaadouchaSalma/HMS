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
    
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : Controller
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly ApplicationDbContext _context;    
        private readonly UserManager<ApplicationUser> _userManager;
       
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


        
        [HttpGet("generate-pdf/{id}")]
        public async Task<IActionResult> GeneratePrescriptionPdf(Guid id)
        {
            // Fetch prescription from DB
            Prescription prescription = await _prescriptionRepository.GetPrescriptionByIdAsync(id);
            if (prescription == null)
            {
                return NotFound("Prescription not found");
            }

            // Generate PDF
            byte[] pdfBytes = PdfGenerator.FillPrescriptionTemplate(prescription);
            return File(pdfBytes, "application/pdf", "Prescription.pdf");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrescriptions(Guid id)
        {
            var patient = await _context.Patients
                .Include(p => p.Prescriptions)
                .ThenInclude(pr => pr.Medecin)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
            {
                return NotFound();
            }

            var prescriptions = patient.Prescriptions.Select(pr => new
            {
                id = pr.Id,
                DatePrescription = pr.Dateprescription,
                MedecinNomComplet = $"{pr.Medecin?.Prenom} {pr.Medecin?.Nom}",
                NomsMedicaments = ExtraireNomsMedicaments(pr.ListeMed)
            }).ToList();

            return Ok(prescriptions);
        }

        private List<string> ExtraireNomsMedicaments(string listeMedJson)
        {
            try
            {              
                var jsonString = JsonConvert.DeserializeObject<string>(listeMedJson);
                var listeMedicaments = JsonConvert.DeserializeObject<List<dynamic>>(jsonString);

                return listeMedicaments?.Select(m => (string)m.nom).Where(nom => !string.IsNullOrEmpty(nom)).ToList() ?? new List<string>();
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Erreur de désérialisation: {ex.Message}");
                return new List<string>();
            }
        }





    }


}

