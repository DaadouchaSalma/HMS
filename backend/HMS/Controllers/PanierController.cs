using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace HMS.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PanierController : ControllerBase
    {
        private readonly IPanierRepository _panierRepo;
        private readonly ApplicationDbContext _context;


        public PanierController(IPanierRepository panierRepo , ApplicationDbContext context)
        {
            _panierRepo = panierRepo;
            _context = context;
        }

        [HttpPost("add")]
        [Authorize(Roles = "Pharmacien,Medecin")]
        public async Task<IActionResult> AddToPanier([FromBody] Prescription prescription)
        {
            if (prescription == null || string.IsNullOrEmpty(prescription.ListeMed))
                return BadRequest("Invalid prescription data.");

            var panier = await _panierRepo.AddToPanierAsync(prescription);
            return Ok(panier);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> GetAllPaniers()
        {
            var result = await _panierRepo.GetAllPaniersAsync();
            return Ok(result);
        }

        [HttpGet("patient/{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> GetByPatient(Guid id)
        {
            var result = await _panierRepo.GetPaniersByPatientAsync(id);
            return Ok(result);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> GetPanierById(Guid id)
        {
            var panier = await _panierRepo.GetPanierByIdAsync(id);
            if (panier == null)
            {
                return NotFound(new { message = "Panier not found" });
            }
            return Ok(panier);
        }

        [HttpPost("validate/{panierId}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> Validate(Guid panierId)
        {
            var result = await _panierRepo.ValidatePanierAsync(panierId);
            if (result == null)
                return NotFound("Panier not found.");
            return Ok(result);
        }

        [HttpPost("refresh-missing-meds")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> RefreshMissing()
        {
            await _panierRepo.RefreshAllPaniersMissingMedsAsync();
            return Ok(new { message = "All paniers updated." });
        }

        [HttpPut("{panierId}/status")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> ChangeStatus(Guid panierId)
        {

            var result = await _panierRepo.ChangePanierStatusAsync(panierId);

            if (!result)
            {
                return NotFound("Panier not found.");
            }

            return Ok(new { message = "Panier status updated successfully." });
        }

        [HttpGet("meds-per-month")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetMedsPerMonth()
        {
            var paniers = _context.Paniers
                .Include(p => p.medPaniers)
                .ToList();

            var result = _panierRepo.GetMonthlyMedCounts(paniers);
            return Ok(result);
        }

    }
}