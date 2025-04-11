using HMS.Models;
using HMS.Repositories;
using HMS.Interfaces;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FournisseurController : ControllerBase
    {
        private readonly IFournisseur _repository;

        public FournisseurController(IFournisseur repository)
        {
            _repository = repository;
        }

        // GET: api/fournisseur

        [HttpGet]
        [Authorize(Roles = "Pharmacien")]

        public async Task<IActionResult> GetAll()
        {
            var fournisseurs = await _repository.GetAllAsync();
            return Ok(fournisseurs);
        }

        // GET: api/fournisseur/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var fournisseur = await _repository.GetByIdAsync(id);
            if (fournisseur == null)
                return NotFound();

            return Ok(fournisseur);
        }

        // POST: api/fournisseur
        [HttpPost]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> Create([FromBody] Fournisseur fournisseur)
        {
            if (fournisseur == null)
                return BadRequest("Invalid data");

            var newFournisseur = await _repository.AddAsync(fournisseur);
            return CreatedAtAction(nameof(GetById), new { id = newFournisseur.Id }, newFournisseur);
        }

        // PUT: api/fournisseur/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Fournisseur fournisseur)
        {
            if (fournisseur == null || id != fournisseur.Id)
                return BadRequest("Invalid data");

            var updatedFournisseur = await _repository.UpdateAsync(fournisseur);
            return Ok(updatedFournisseur);
        }

        // DELETE: api/fournisseur/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Pharmacien")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
