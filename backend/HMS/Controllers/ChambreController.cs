using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;



namespace HMS.Controllers { 
    
[Route("api/[controller]")]
[ApiController]

    public class ChambreController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ChambreController(ApplicationDbContext context)
        {
            _context = context;
        }
        //ajout chambre
        [HttpPost]
        public async Task<IActionResult> AddChambre([FromBody] Chambre chambre)
        {
            if (chambre == null) return BadRequest("Données invalides");

            _context.Chambres.Add(chambre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Chambre ajoutée avec succès" });
        }
        //toutes le chambres 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Chambre>>> GetChambres()
        {
            return await _context.Chambres.ToListAsync();
        }
        //chambre by id 

        [HttpGet("{id}")]
        public async Task<ActionResult<Chambre>> GetChambreById(Guid id)
        {
            var chambre = await _context.Chambres.FindAsync(id);

            if (chambre == null)
            {
                return NotFound(); 
            }

            return Ok(chambre); 
        }

        //modifier une chambre 
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChambre(Guid id, [FromBody] Chambre chambre)
        {
           

            var existingChambre = await _context.Chambres.FindAsync(id);
            if (existingChambre == null)
                return NotFound(new { message = "Chambre non trouvée" });

            existingChambre.NumeroChambre = chambre.NumeroChambre;
            existingChambre.Services = chambre.Services;
            existingChambre.Niveau_dequipement = chambre.Niveau_dequipement;
            existingChambre.Nb_lit = chambre.Nb_lit;
            existingChambre.etage = chambre.etage;
            existingChambre.statut = chambre.statut;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Chambre mise à jour avec succès" });
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}




