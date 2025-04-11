using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PersonnelAdminController : Controller
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        

        public PersonnelAdminController(IAdminRepository adminRepository, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PersonnelAdministrative>>> GetPersonnelAs()
        {
            var personnelAdministratives = await _adminRepository.GetAll();
            return Ok(personnelAdministratives);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> addPersonnelAdministrative([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Créer user dans Identity
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
                Password = model.Password,
                Type = model.Type,
                IdentityUserId = user.Id
            };
            user.PersonnelId = personnelA.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "PersonnelAdministratif");

            await _adminRepository.Add(personnelA);
            await _adminRepository.SaveAsync();

            return Ok(new { message = "PersonnelAdministratif ajouté avec succès" });
        }
        //hethi pour personnel without id 
        [HttpGet("get")]
        [Authorize(Roles = "PersonnelAdministratif")]
        public async Task<ActionResult<PersonnelAdministrative>> GetPersonnelAById()
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

                 // Vérifier que le patient existe
                 var personnelA = await _adminRepository.GetByIdentityUserIdAsync(identityUserId);
                 if (personnelA == null)
                 {
                     return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
                 }
                //personnelA.Id
                var personnelAdministrative = await _adminRepository.GetByIdAsync(personnelA.Id);
                return personnelAdministrative != null ? Ok(personnelAdministrative) : NotFound("personnelAdministrative introuvable");
            }
            catch (Exception)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }
        //pour l admin with id 
        [HttpGet("getA/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PersonnelAdministrative>> GetPersonnelAByIdAdmin(Guid id)
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

        [HttpPut("editInfo")]
        [Authorize(Roles = "PersonnelAdministratif")]
        public async Task<IActionResult> UpdatePersonnelA([FromBody] PersonnelAdministrative updatedPersonnelA)
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

             // Vérifier que le patient existe
             var personnel_a = await _adminRepository.GetByIdentityUserIdAsync(identityUserId);
             if (personnel_a == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }
            //personnel_a.Id nhotha f blasset id

            var existingPersonnelA = _adminRepository.GetById(personnel_a.Id);
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

            var user = await _userManager.FindByIdAsync(existingPersonnelA.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedPersonnelA.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }

            _adminRepository.Update(existingPersonnelA);
            _adminRepository.Save();

            return Ok(new { message = "personnelA mis à jour avec succès", personnelA = existingPersonnelA });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePersonnelA(Guid id)
        {
            var personnelA = await _adminRepository.GetByIdAsync(id);
            if (personnelA == null)
            {
                return NotFound(new { message = "Personnel administratif introuvable" });
            }

            // Récupérer l'utilisateur associé (si existant)
            var user = await _userManager.FindByIdAsync(personnelA.IdentityUserId.ToString()); // Assurez-vous que UserId est bien un GUID

            // Supprimer d'abord personnelA
            _adminRepository.Delete(personnelA);
            await _adminRepository.SaveAsync();

            // Supprimer l'utilisateur associé (si trouvé)
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de la suppression de l'utilisateur associé" });
                }
            }

            return Ok(new { message = "Personnel administratif et utilisateur supprimés avec succès" });
        }


        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePersonnelAdmin(Guid id, [FromBody] PersonnelAdministrative updatedPersonnelA)
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

            var user = await _userManager.FindByIdAsync(existingPersonnelA.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedPersonnelA.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }

            _adminRepository.Update(existingPersonnelA);
            _adminRepository.Save();

            return Ok(new { message = "personnelA mis à jour avec succès", personnelA = existingPersonnelA });
        }

    }
}
