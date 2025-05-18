using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;
using HMS.Interfaces;
using HMS.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
namespace HMS.Controllers { 
    [Route("api/[controller]")]
    [ApiController]

    public class ReclamationController:Controller
    {
        private readonly IReclamationRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPatientRepository _patientRepository;

        public ReclamationController(IReclamationRepository repository, ApplicationDbContext context, IPatientRepository patientRepository, UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _context = context;
            _userManager = userManager;
            _patientRepository = patientRepository;

        }
        //liste Reclamation 
        [Authorize(Roles = "PersonnelAdministrative, Admin")]
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
        [Authorize(Roles = "Patient")]
        [HttpPost()]
        public async Task<IActionResult> Create([FromBody] Reclamation reclamation)
        {
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

                var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
                if (patient == null)
                {
                    return BadRequest(new { message = "Aucun patieent trouvé pour cet utilisateur." });
                }
                if (reclamation == null || reclamation.ChambreId == Guid.Empty)
                    return BadRequest(new { message = "Données invalides ou chambre manquante" });

                // Vérifier si la chambre existe
                var chambreExiste = await _context.Chambres.AnyAsync(c => c.Id == reclamation.ChambreId);
                if (!chambreExiste)
                    return NotFound(new { message = "Numéro de chambre non trouvé" });

                reclamation.PatientId = patient.Id;

                await _repository.Add(reclamation);

                return Ok(new { message = "Réclamation ajoutée avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //supprimer reclamation 
        [Authorize(Roles = "PersonnelAdministrative")]
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
