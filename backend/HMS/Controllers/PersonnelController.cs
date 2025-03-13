using System.Text.Json;
using HMS.Models;
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

        public PersonnelController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Personnel>>> GetPersonnels()
        {
            return await _context.Personnels.ToListAsync();
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddPersonnel([FromBody] Personnel personnel)
        {
            if (personnel == null) return BadRequest("Données invalides");

            _context.Personnels.Add(personnel);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Personnel ajouté avec succès" });
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






    }
}
