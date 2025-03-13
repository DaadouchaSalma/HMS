using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IAdminRepository _adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonnelAdministrative>>> GetPersonnelAs()
        {
            var personnelAdministratives = await _adminRepository.GetAll();
            return Ok(personnelAdministratives);
        }

        // Ajouter un médecin
        [HttpPost("add")]
        public async Task<IActionResult> AddPersonnelA([FromBody] PersonnelAdministrative personnelAdministrative)
        {
            if (personnelAdministrative == null) return BadRequest("Données invalides");

            await _adminRepository.Add(personnelAdministrative);
            await _adminRepository.SaveAsync();

            return Ok(new { message = "personnel  admin ajouté avec succès" });
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<PersonnelAdministrative>> GetPersonnelAById(Guid id)
        {
            try
            {
                var personnelAdministrative = await _adminRepository.GetByIdAsync(id);
                return personnelAdministrative != null ? Ok(personnelAdministrative) : NotFound("personnelAdministrative introuvable");
            }
            catch (Exception)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }

        [HttpPut("editInfo/{id}")]
        public IActionResult UpdatePersonnelA(Guid id, [FromBody] PersonnelAdministrative updatedPersonnelA)
        {
            var existingPersonnelA = _adminRepository.GetById(id);
            if (existingPersonnelA == null)
            {
                return NotFound(new { message = "personnelA non trouvé" });
            }

            // Mise à jour des propriétés
            existingPersonnelA.Nom = updatedPersonnelA.Nom;
            existingPersonnelA.Prenom = updatedPersonnelA.Prenom;
            existingPersonnelA.Email = updatedPersonnelA.Email;
            existingPersonnelA.Password = updatedPersonnelA.Password;
            existingPersonnelA.Date_Naiss = updatedPersonnelA.Date_Naiss;
            existingPersonnelA.Date_Emb = updatedPersonnelA.Date_Emb;
            existingPersonnelA.Salaire = updatedPersonnelA.Salaire;
            existingPersonnelA.Telephone = updatedPersonnelA.Telephone;
            existingPersonnelA.Type = updatedPersonnelA.Type;
            existingPersonnelA.Adresse = updatedPersonnelA.Adresse;
            existingPersonnelA.Statut = updatedPersonnelA.Statut;

            _adminRepository.Update(existingPersonnelA);
            _adminRepository.Save();

            return Ok(new { message = "personnelA mis à jour avec succès", personnelA = existingPersonnelA });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersonnelA(Guid id)
        {
            var personnelA = await _adminRepository.GetByIdAsync(id);
            if (personnelA == null)
            {
                return NotFound(new { message = "personnelA introuvable" });
            }

            _adminRepository.Delete(personnelA);
            await _adminRepository.SaveAsync();

            return Ok(new { message = "personnelA supprimé avec succès" });
        }

    }
}
