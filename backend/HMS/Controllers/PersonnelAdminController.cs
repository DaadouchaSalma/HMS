using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PersonnelAdminController : Controller
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public PersonnelAdminController(IAdminRepository adminRepository, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager,
                              ApplicationDbContext context)
        {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonnelAdministrative>>> GetPersonnelAs()
        {
            var personnelAdministratives = await _adminRepository.GetAll();
            return Ok(personnelAdministratives);
        }

        // Ajouter un médecin
        /* [HttpPost("add")]
         public async Task<IActionResult> AddPersonnelA([FromBody] PersonnelAdministrative personnelAdministrative)
         {
             if (personnelAdministrative == null) return BadRequest("Données invalides");

             await _adminRepository.Add(personnelAdministrative);
             await _adminRepository.SaveAsync();

             return Ok(new { message = "personnel  admin ajouté avec succès" });
         }*/

        [HttpPost("add")]
        public async Task<IActionResult> AjouterMedecin([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 🔹 1. Créer l'utilisateur dans Identity
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Nom = model.Nom,
                Prenom = model.Prenom,
            };



            // Ajouter dans la table 
            var personnelA = new PersonnelAdministrative
            {
                Id = Guid.NewGuid(),
                Nom = model.Nom,
                Prenom = model.Prenom,
                Email = model.Email,
                Date_Naiss = model.Date_Naiss,
                Date_Emb = model.Date_Emb ?? DateOnly.MinValue,
                Salaire = model.Salaire ?? 0,
                Telephone = model.Telephone,
                Adresse = model.Adresse,
                Statut = model.Statut,
                IdentityUserId = user.Id
            };
            user.PersonnelId = personnelA.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "PersonnelAdministratif");

            _context.Admins.Add(personnelA);
            await _context.SaveChangesAsync();

            return Ok(new { message = "PersonnelAdministratif ajouté avec succès" });
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
            //existingPersonnelA.Password = updatedPersonnelA.Password;
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
