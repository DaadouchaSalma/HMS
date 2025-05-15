using System.Text.Json;
using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonnelController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IPersonnelRepository _personnelRepository;



        public PersonnelController(ApplicationDbContext context, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager
                            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Personnel>>> GetPersonnels()
        {
            return await _context.Personnels.ToListAsync();
        }
        /* [HttpPost("add")]
         public async Task<IActionResult> AddPersonnel([FromBody] Personnel personnel)
         {
             if (personnel == null) return BadRequest("Données invalides");

             _context.Personnels.Add(personnel);
             await _context.SaveChangesAsync();

             return Ok(new { message = "Personnel ajouté avec succès" });
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
            var personnel = new Personnel
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
                Password = model.Password
            };
            user.PersonnelId = personnel.Id;

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Admin");

            _context.Personnels.Add(personnel);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin ajouté avec succès" });
        }


        [HttpGet("get/{id}")]
        public async Task<ActionResult<Personnel>> GetPersonnelById(Guid id)
        {
            try {
                var personnel = await _context.Personnels.FindAsync(id);
                return personnel != null ? Ok(personnel) : NotFound("Personnel introuvable");
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Une erreur interne est survenue");
            }
        }
        [HttpPut("editInfo/{id}")]
        public async Task<IActionResult> EditPersonnel(Guid id, [FromBody] Personnel updatedPersonnel)
        {
            if (updatedPersonnel == null)
                return BadRequest("Données invalides");

            // Find the existing personnel by Id
            var existingPersonnel = await _context.Personnels.FindAsync(id);
            if (existingPersonnel == null)
                return NotFound("Personnel introuvable");

            // Update fields with new data
            existingPersonnel.Nom = updatedPersonnel.Nom;
            existingPersonnel.Prenom = updatedPersonnel.Prenom;
            existingPersonnel.Email = updatedPersonnel.Email;
            existingPersonnel.Password = updatedPersonnel.Password;
            existingPersonnel.Date_Naiss = updatedPersonnel.Date_Naiss;
            existingPersonnel.Date_Emb = updatedPersonnel.Date_Emb;
            existingPersonnel.Salaire = updatedPersonnel.Salaire;
            existingPersonnel.Telephone = updatedPersonnel.Telephone;
            existingPersonnel.Type = updatedPersonnel.Type;
            existingPersonnel.Adresse = updatedPersonnel.Adresse;
            existingPersonnel.Statut = updatedPersonnel.Statut;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { message = "Personnel mis à jour avec succès" });
        }


        [HttpGet("count")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMedecinCount()
        {
            var count = await _personnelRepository.CountAsync();

            return Ok(count);
        }



    }
}
