using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedMatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedMatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Get all medical materials
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var materials = await _context.Medicaments
                .Include(m => m.fournisseur) // Include Fournisseur details
                .ToListAsync();
            return Ok(materials);
        }

        // ✅ Get a specific medical material by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var material = await _context.Medicaments
                .Include(m => m.fournisseur)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (material == null)
                return NotFound();

            return Ok(material);
        }

        // ✅ Create a new medical material        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Medicament medMat)
        {
            if (medMat == null)
                return BadRequest("Medicament data is required.");

            if (medMat.FournisseurId == Guid.Empty)
                return BadRequest("FournisseurId is required.");

            if (medMat.CategorieId == Guid.Empty)
                return BadRequest("CategorieId is required.");

            var fournisseur = await _context.fournisseurs.FindAsync(medMat.FournisseurId);
            if (fournisseur == null)
                return NotFound("Fournisseur not found.");

            var categorie = await _context.categories.FindAsync(medMat.CategorieId);
            if (categorie == null)
                return NotFound("Categorie not found.");

            medMat.Id = Guid.NewGuid();
            medMat.fournisseur = fournisseur;
            medMat.categorie = categorie;
            _context.Medicaments.Add(medMat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = medMat.Id }, medMat);
        }



        // ✅ Update an existing medical material
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Medicament medMat)
        {
            if (medMat == null || medMat.Id != id)
                return BadRequest();

            var existingMaterial = await _context.Medicaments.FindAsync(id);
            if (existingMaterial == null)
                return NotFound();

            existingMaterial.Nom = medMat.Nom;
            existingMaterial.Description = medMat.Description;
            existingMaterial.Nbr_stock = medMat.Nbr_stock;
            existingMaterial.Date_Exp = medMat.Date_Exp;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Delete a medical material
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var material = await _context.Medicaments.FindAsync(id);
            if (material == null)
                return NotFound();

            _context.Medicaments.Remove(material);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
