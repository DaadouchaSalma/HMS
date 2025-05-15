using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategorieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategorieController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categorie
        [HttpGet]
        [Authorize(Roles = "Pharmacien ,Medecin")]
        public async Task<ActionResult<IEnumerable<CategorieMedicament>>> GetCategories()
        {
            return await _context.categories.ToListAsync();
        }

        // GET: api/Categorie/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<ActionResult<CategorieMedicament>> GetCategorie(Guid id)
        {
            var categorie = await _context.categories.FindAsync(id);

            if (categorie == null)
            {
                return NotFound("Category not found.");
            }

            return categorie;
        }

        // POST: api/Categorie
        [HttpPost]
        [Authorize(Roles = "Pharmacien")]
        public async Task<ActionResult<CategorieMedicament>> CreateCategorie(CategorieMedicament categorie)
        {
            if (categorie == null || string.IsNullOrWhiteSpace(categorie.Name))
            {
                return BadRequest("Category name is required.");
            }

            categorie.Id = Guid.NewGuid(); // Assign new ID
            _context.categories.Add(categorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategorie), new { id = categorie.Id }, categorie);
        }

        // PUT: api/Categorie/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> UpdateCategorie(Guid id, CategorieMedicament categorie)
        {
            if (id != categorie.Id)
            {
                return BadRequest("ID mismatch.");
            }

            var existingCategorie = await _context.categories.FindAsync(id);
            if (existingCategorie == null)
            {
                return NotFound("Category not found.");
            }

            existingCategorie.Name = categorie.Name;

            _context.Entry(existingCategorie).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Categorie/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> DeleteCategorie(Guid id)
        {
            var categorie = await _context.categories.FindAsync(id);
            if (categorie == null)
            {
                return NotFound("Category not found.");
            }

            _context.categories.Remove(categorie);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
