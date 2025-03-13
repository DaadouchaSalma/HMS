using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PharmacienController : Controller
    {
        private readonly IPharmacieRepository _pharmacienRepository;

        public PharmacienController(IPharmacieRepository pharmacienRepository)
        {
            _pharmacienRepository = pharmacienRepository;
        }
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<Pharmacien>>> GetPharmaciens()
        {
            return await _context.Pharmaciens.ToListAsync();
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPharmacien([FromBody] Pharmacien pharmacien)
        {
            if (pharmacien == null) return BadRequest("Données invalides");

            _context.Pharmaciens.Add(pharmacien);
            await _context.SaveChangesAsync();

            return Ok(new { message = "pharmacien ajouté avec succès" });
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Pharmacien>> GetPharmacienById(Guid id)
        {
            try
            {
                var pharmacien = await _context.Pharmaciens.FindAsync(id);
                return pharmacien != null ? Ok(pharmacien) : NotFound("pharmacien introuvable");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }
        */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pharmacien>>> GetPharmaciens()
        {
            var pharmaciens = await _pharmacienRepository.GetAll();
            return Ok(pharmaciens);
        }

        // Ajouter un médecin
        [HttpPost("add")]
        public async Task<IActionResult> AddPharmacien([FromBody] Pharmacien pharmacien)
        {
            if (pharmacien == null) return BadRequest("Données invalides");

            await _pharmacienRepository.Add(pharmacien);
            await _pharmacienRepository.SaveAsync();

            return Ok(new { message = "pharmacien ajouté avec succès" });
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<Pharmacien>> GetPharmacienById(Guid id)
        {
            try
            {
                var pharmacien = await _pharmacienRepository.GetByIdAsync(id);
                return pharmacien != null ? Ok(pharmacien) : NotFound("pharmacien introuvable");
            }
            catch (Exception)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }

        [HttpPut("editInfo/{id}")]
        public IActionResult UpdatePharmacien(Guid id, [FromBody] Pharmacien updatedPharmacien)
        {
            var existingPharmacien = _pharmacienRepository.GetById(id);
            if (existingPharmacien == null)
            {
                return NotFound(new { message = "Pharmacien non trouvé" });
            }

            // Mise à jour des propriétés
            existingPharmacien.Nom = updatedPharmacien.Nom;
            existingPharmacien.Prenom = updatedPharmacien.Prenom;
            existingPharmacien.Email = updatedPharmacien.Email;
            existingPharmacien.Password = updatedPharmacien.Password;
            existingPharmacien.Date_Naiss = updatedPharmacien.Date_Naiss;
            existingPharmacien.Date_Emb = updatedPharmacien.Date_Emb;
            existingPharmacien.Salaire = updatedPharmacien.Salaire;
            existingPharmacien.Telephone = updatedPharmacien.Telephone;
            existingPharmacien.Type = updatedPharmacien.Type;
            existingPharmacien.Adresse = updatedPharmacien.Adresse;
            existingPharmacien.Statut = updatedPharmacien.Statut;

            _pharmacienRepository.Update(existingPharmacien);
            _pharmacienRepository.Save();

            return Ok(new { message = "pharmacien mis à jour avec succès", pharmacien = existingPharmacien });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersonnelA(Guid id)
        {
            var pharmacien = await _pharmacienRepository.GetByIdAsync(id);
            if (pharmacien == null)
            {
                return NotFound(new { message = "pharmacien introuvable" });
            }

            _pharmacienRepository.Delete(pharmacien);
            await _pharmacienRepository.SaveAsync();

            return Ok(new { message = "pharmacien supprimé avec succès" });
        }
    }
}
