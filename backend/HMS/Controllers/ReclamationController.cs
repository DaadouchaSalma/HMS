using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;
using HMS.Interfaces;
namespace HMS.Controllers { 
    [Route("api/[controller]")]
    [ApiController]

    public class ReclamationController:Controller
    {
        private readonly IReclamationRepository _repository;
        private readonly ApplicationDbContext _context;

        public ReclamationController(IReclamationRepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }
        //liste Reclamation 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reclamation>>> GetAll()
        {
            try
            {
                var reclamations = await _repository.GetAll();
                return Ok(reclamations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur : {ex.Message} - {ex.InnerException?.Message}");
            }
        }
        //ajout reclamation 
        [HttpPost("{patientId}")]
        public async Task<IActionResult> Create(Guid patientId, [FromBody] Reclamation reclamation)
        {
            if (reclamation == null || reclamation.ChambreId == Guid.Empty)
                return BadRequest(new { message = "Données invalides ou chambre manquante" });

            // Vérifier si la chambre existe
            var chambreExiste = await _context.Chambres.AnyAsync(c => c.Id == reclamation.ChambreId);
            if (!chambreExiste)
                return NotFound(new { message = "Numéro de chambre non trouvé" });

            reclamation.PatientId = patientId;

            await _repository.Add(reclamation);

            return Ok(new { message = "Réclamation ajoutée avec succès" });
        }


        //supprimer reclamation 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _repository.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
        [HttpGet("chambres")]
        public async Task<IActionResult> GetChambres()
        {
            var chambres = await _context.Chambres
                .Select(c => new { c.Id, c.NumeroChambre }) 
                .ToListAsync();

            return Ok(chambres);
        }


    }
}
