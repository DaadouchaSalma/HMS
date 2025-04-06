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
        private readonly ApplicationDbContext _context; 

        public MedecinController(IMedecinRepository medecinRepository, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager,
                              ApplicationDbContext context)
        {
            _medecinRepository = medecinRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
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
        /* [HttpPost("add")]
         public async Task<IActionResult> AddMedecin([FromBody] Medecin medecin)
         {
             if (medecin == null) return BadRequest("Données invalides");

             await _medecinRepository.Add(medecin);
             await _medecinRepository.SaveAsync();

             return Ok(new { message = "Médecin ajouté avec succès" });
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
                //Role = "Medecin"
            };

          

            // Ajouter dans la table `Medecins`
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
                service = model.Service 
            };
            user.PersonnelId = medecin.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Medecin");

            _context.Medecins.Add(medecin);
            await _context.SaveChangesAsync();

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
            //existingMedecin.Password = updatedMedecin.Password;
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
