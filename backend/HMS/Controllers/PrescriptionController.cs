using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using HMS.Interfaces;
using HMS.Repositories;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : Controller
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly ApplicationDbContext _context;

        public PrescriptionController(IPrescriptionRepository prescriptionRepository, ApplicationDbContext context)
        {
            _prescriptionRepository = prescriptionRepository;
            _context = context;
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddPrescription([FromBody] Prescription prescription)
        {

            if (prescription == null)
            {
                return BadRequest("Prescription data is required.");
            }

            try
            {
                prescription.ListeMed = JsonConvert.SerializeObject(prescription.ListeMed);
                await _prescriptionRepository.AddPrescriptionAsync(prescription);
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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

