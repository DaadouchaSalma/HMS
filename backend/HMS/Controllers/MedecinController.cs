using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedecinController : Controller
    {
        private readonly IMedecinRepository _medecinRepository;

        public MedecinController(IMedecinRepository medecinRepository)
        {
            _medecinRepository = medecinRepository;
        }
        
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<Medecin>>> GetMedecins()

        {
            return await _context.Medecins.ToListAsync();
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddMedecin([FromBody] Medecin medecin)
        {
            if (medecin == null) return BadRequest("Données invalides");

            _context.Medecins.Add(medecin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Médecin ajouté avec succès" });
        }*/

        // Récupérer tous les médecins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medecin>>> GetMedecins()
        {
            var medecins = await _medecinRepository.GetAll();
            return Ok(medecins);
        }

        // Ajouter un médecin
        [HttpPost("add")]
        public async Task<IActionResult> AddMedecin([FromBody] Medecin medecin)
        {
            if (medecin == null) return BadRequest("Données invalides");

            await _medecinRepository.Add(medecin);
            await _medecinRepository.SaveAsync();

            return Ok(new { message = "Médecin ajouté avec succès" });
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Medecin>> GetMedecinById(Guid id)
        {
            try
            {
                var medecin = await _medecinRepository.GetByIdAsync(id);
                return medecin != null ? Ok(medecin) : NotFound("Médecin introuvable");
            }
            catch (Exception)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }

        [HttpPut("editInfo/{id}")]
        public IActionResult UpdateMedecin(Guid id, [FromBody] Medecin updatedMedecin)
        {
            var existingMedecin = _medecinRepository.GetById(id);
            if (existingMedecin == null)
            {
                return NotFound(new { message = "Médecin non trouvé" });
            }

            // Mise à jour des propriétés
            existingMedecin.Nom = updatedMedecin.Nom;
            existingMedecin.Prenom = updatedMedecin.Prenom;
            existingMedecin.Email = updatedMedecin.Email;
            existingMedecin.Password = updatedMedecin.Password;
            existingMedecin.Date_Naiss = updatedMedecin.Date_Naiss;
            existingMedecin.Date_Emb = updatedMedecin.Date_Emb;
            existingMedecin.Salaire = updatedMedecin.Salaire;
            existingMedecin.Telephone = updatedMedecin.Telephone;
            existingMedecin.Type = updatedMedecin.Type;
            existingMedecin.Adresse = updatedMedecin.Adresse;
            existingMedecin.Statut = updatedMedecin.Statut;
            existingMedecin.Grad_med = updatedMedecin.Grad_med;
            existingMedecin.service = updatedMedecin.service;

            _medecinRepository.Update(existingMedecin);
            _medecinRepository.Save();

            return Ok(new { message = "Médecin mis à jour avec succès", medecin = existingMedecin });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedecin(Guid id)
        {
            var medecin = await _medecinRepository.GetByIdAsync(id);
            if (medecin == null)
            {
                return NotFound(new { message = "Médecin introuvable" });
            }

            _medecinRepository.Delete(medecin);
            await _medecinRepository.SaveAsync();

            return Ok(new { message = "Médecin supprimé avec succès" });
        }




    }
}
