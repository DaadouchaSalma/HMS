using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedecinController : Controller
    {
        private readonly IMedecinRepository _medecinRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        
        public MedecinController(IMedecinRepository medecinRepository, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager
                              )
        {
            _medecinRepository = medecinRepository;
            _userManager = userManager;
            _roleManager = roleManager;
          
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
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetMedecins()
        {
            var medecins = await _medecinRepository.GetAll();

            var medecinsWithPasswordHash = medecins.Select(m => new
            {
                m.Id,
                m.Nom,
                m.Prenom,
                m.Email,
                m.Date_Naiss,
                m.Date_Emb,
                m.Salaire,
                m.Telephone,
                m.Adresse,
                m.Statut,
                m.Grad_med,
                m.service,
                m.Type,
                PasswordHash = _userManager.Users.FirstOrDefault(u => u.Id == m.IdentityUserId)?.PasswordHash
            }).ToList();

            return Ok(medecinsWithPasswordHash);
        }


        // Ajouter un médecin
        /* [HttpPost("add")]
         public async Task<IActionResult> AddMedecin([FromBody] Medecin medecin)
         {
             if (medecin == null) return BadRequest("Données invalides");

             await _medecinRepository.Add(medecin);
             await _medecinRepository.SaveAsync();

             return Ok(new { message = "Médecin ajouté avec succès" });
         }*/

        [HttpPost("add")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AjouterMedecin([FromBody] RegisterModel model)
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

          

            // Ajouter dans la tablemd
            var medecin = new Medecin
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
                IdentityUserId = user.Id,
                Grad_med = model.Grad_med, 
                service = model.Service ,
                Password=model.Password,
                Type=model.Type
            };
            user.PersonnelId = medecin.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Medecin");

            await _medecinRepository.Add(medecin);
            await _medecinRepository.SaveAsync();

            return Ok(new { message = "Médecin ajouté avec succès" });
        }
        //en tant que medecin without id 
        [HttpGet("get/{id}")]
        [Authorize(Roles = "Medecin")]
        public async Task<ActionResult<Medecin>> GetMedecinById(Guid id)
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
             var medecin = await _medecinRepository.GetByIdentityUserIdAsync(identityUserId);
             if (medecin == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }*/
            //medecin.Id //fi blasset l id 
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
        //en tant admin with id 
        [HttpGet("getA/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<Medecin>> GetMedecinByIdAdmin(Guid id)
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

        // en tant que medecin
        [HttpPut("editInfo/{id}")]
        //[Authorize(Roles = "Medecin")]
        public async Task<IActionResult> UpdateMedecin(Guid id, [FromBody] Medecin updatedMedecin)
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
             var medecin = await _medecinRepository.GetByIdentityUserIdAsync(identityUserId);
             if (medecin == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }*/
            //medecin.Id nhotha f blasset id
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

            var user = await _userManager.FindByIdAsync(existingMedecin.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedMedecin.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }

            _medecinRepository.Update(existingMedecin);
            _medecinRepository.Save();

            return Ok(new { message = "Médecin mis à jour avec succès", medecin = existingMedecin });
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMedecin(Guid id)
        {
            var medecin = await _medecinRepository.GetByIdAsync(id);
            if (medecin == null)
            {
                return NotFound(new { message = "Médecin introuvable" });
            }

            // Récupérer l'utilisateur associé dans AspNetUsers
            var user = await _userManager.FindByIdAsync(medecin.IdentityUserId.ToString());

            // Supprimer d'abord le médecin
            _medecinRepository.Delete(medecin);
            await _medecinRepository.SaveAsync();

            // Supprimer l'utilisateur associé
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de la suppression de l'utilisateur associé" });
                }
            }

            return Ok(new { message = "Médecin et utilisateur supprimés avec succès" });
        }

        //en tant qu'admin
        [HttpPut("edit/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMedecinAdmin(Guid id, [FromBody] Medecin updatedMedecin)
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

            var user = await _userManager.FindByIdAsync(existingMedecin.IdentityUserId);
            if (user != null)
            {
                var hasPassword = await _userManager.HasPasswordAsync(user);
                if (hasPassword)
                {
                    await _userManager.RemovePasswordAsync(user);
                }

                var addPassword = await _userManager.AddPasswordAsync(user, updatedMedecin.Password);
                if (!addPassword.Succeeded)
                {
                    return BadRequest(new { message = "Erreur lors de l'ajout du nouveau mot de passe" });
                }
            }

            _medecinRepository.Update(existingMedecin);
            _medecinRepository.Save();

            return Ok(new { message = "Médecin mis à jour avec succès", medecin = existingMedecin });
        }





    }
}
