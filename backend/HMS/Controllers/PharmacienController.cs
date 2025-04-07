using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PharmacienController : Controller
    {
        private readonly IPharmacieRepository _pharmacienRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        

        public PharmacienController(IPharmacieRepository pharmacienRepository, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager)
        {
            _pharmacienRepository = pharmacienRepository;
            _userManager = userManager;
            _roleManager = roleManager;
           
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
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Pharmacien>>> GetPharmaciens()
        {
            var pharmaciens = await _pharmacienRepository.GetAll();
            return Ok(pharmaciens);
        }

        // Ajouter un médecin
        /*[HttpPost("add")]
        public async Task<IActionResult> AddPharmacien([FromBody] Pharmacien pharmacien)
        {
            if (pharmacien == null) return BadRequest("Données invalides");

            await _pharmacienRepository.Add(pharmacien);
            await _pharmacienRepository.SaveAsync();

            return Ok(new { message = "pharmacien ajouté avec succès" });
        }*/

        [HttpPost("add")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddPharmacien([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            //Créer user dans Identity
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Nom = model.Nom,
                Prenom = model.Prenom,
            };



            // Ajouter dans la table 
            var pharmacien = new Pharmacien
            {
                Id = Guid.NewGuid(),
                Nom = model.Nom,
                Prenom = model.Prenom,
                Email = model.Email,
                Date_Naiss = model.Date_Naiss,
                Date_Emb = model.Date_Emb ?? DateOnly.MinValue,
                Salaire = model.Salaire ?? 0,
                Telephone = model.Telephone,
                Adresse=model.Adresse,
                Statut=model.Statut,
                Password=model.Password,
                Type=model.Type,
                IdentityUserId = user.Id
            };
            user.PersonnelId = pharmacien.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Pharmacien");

            await _pharmacienRepository.Add(pharmacien);
            await _pharmacienRepository.SaveAsync();


            return Ok(new { message = "Pharmacien ajouté avec succès" });
        }

        [HttpGet("get/{id}")]
        //[Authorize(Roles = "Pharmacien")]
        public async Task<ActionResult<Pharmacien>> GetPharmacienById(Guid id)
        {
            try
            {
                /* if (!User.Identity.IsAuthenticated)
               {
                   return Unauthorized(new { message = "Utilisateur non authentifié" });
               }*/

                /* var identityUserId = _userManager.GetUserId(User);
                 if (string.IsNullOrEmpty(identityUserId))
                 {
                     return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
                 }

                 // Vérifier que le patient existe
                 var pharmacien = await _pharmacienRepository.GetByIdentityUserIdAsync(identityUserId);
                 if (pharmacien == null)
                 {
                     return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
                 }*/
                //pharmacien.Id
                var pharmacien = await _pharmacienRepository.GetByIdAsync(id);
                return pharmacien != null ? Ok(pharmacien) : NotFound("pharmacien introuvable");
            }
            catch (Exception)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }

        //en tant admin with id 
        [HttpGet("getA/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<Pharmacien>> GetPharmacienByIdAdmin(Guid id)
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
        //[Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> UpdatePharmacien(Guid id, [FromBody] Pharmacien updatedPharmacien)
        {
            /* if (!User.Identity.IsAuthenticated)
              {
                  return Unauthorized(new { message = "Utilisateur non authentifié" });
              }*/

            /* var identityUserId = _userManager.GetUserId(User);
             if (string.IsNullOrEmpty(identityUserId))
             {
                 return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
             }

             // Vérifier que le patient existe
             var pharmacien = await _adminRepository.GetByIdentityUserIdAsync(identityUserId);
             if (pharmacien == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }*/
            //pharmacien.Id nhotha f blasset id
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

            var user = await _userManager.FindByIdAsync(existingPharmacien.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedPharmacien.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }



            _pharmacienRepository.Update(existingPharmacien);
            _pharmacienRepository.Save();

            return Ok(new { message = "pharmacien mis à jour avec succès", pharmacien = existingPharmacien });
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePharmacien(Guid id)
        {
            var pharmacien = await _pharmacienRepository.GetByIdAsync(id);
            if (pharmacien == null)
            {
                return NotFound(new { message = "Pharmacien introuvable" });
            }

            // Récupérer l'utilisateur associé
            var user = await _userManager.FindByIdAsync(pharmacien.IdentityUserId.ToString());

            // Supprimer d'abord le pharmacien
            _pharmacienRepository.Delete(pharmacien);
            await _pharmacienRepository.SaveAsync();

            // Supprimer l'utilisateur associé s'il existe
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de la suppression de l'utilisateur associé" });
                }
            }

            return Ok(new { message = "Pharmacien et utilisateur supprimés avec succès" });
        }


        //en tant qu admin
        [HttpPut("edit/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePharmacienAdmin(Guid id, [FromBody] Pharmacien updatedPharmacien)
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

            var user = await _userManager.FindByIdAsync(existingPharmacien.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedPharmacien.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }



            _pharmacienRepository.Update(existingPharmacien);
            _pharmacienRepository.Save();

            return Ok(new { message = "pharmacien mis à jour avec succès", pharmacien = existingPharmacien });
        }

    }
}
