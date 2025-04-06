using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DossierMController : Controller
    {
        private readonly IDossierMRepository _dossierRepository;

        public DossierMController(IDossierMRepository dossierRepository)
        {
            _dossierRepository = dossierRepository;
        }

        [Authorize(Roles = "Medecin")]
        [HttpPost("new")]
        public async Task<IActionResult> CreateDossierM([FromBody] DossierM dossier)
        {
            if (dossier == null)
            {
                return BadRequest("Invalid dossier data.");
            }

            var createdDossier = await _dossierRepository.CreateDossierM(dossier);
            return Ok(new { message = "DossierM ajouté avec succès" });
        }

        [Authorize(Roles = "Medecin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDossierM(Guid id, [FromBody] DossierM dossierUpdates)
        {
            if (dossierUpdates == null)
            {
                return BadRequest("Invalid dossier updates.");
            }

            var updatedDossier = await _dossierRepository.UpdateDossierM(id, dossierUpdates);
            if (updatedDossier == null)
            {
                return NotFound();
            }

            return Ok(new { message = "DossierM mis à jour avec succès" });
        }
    }
}
