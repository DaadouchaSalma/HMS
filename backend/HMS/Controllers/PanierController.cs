using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PanierController : ControllerBase
{
    private readonly IPanierRepository _panierRepo;

    public PanierController(IPanierRepository panierRepo)
    {
        _panierRepo = panierRepo;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToPanier([FromBody] Prescription prescription)
    {
        if (prescription == null || string.IsNullOrEmpty(prescription.ListeMed))
            return BadRequest("Invalid prescription data.");

        var panier = await _panierRepo.AddToPanierAsync(prescription);
        return Ok(panier);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllPaniers()
    {
        var result = await _panierRepo.GetAllPaniersAsync();
        return Ok(result);
    }

    [HttpGet("patient/{id}")]
    public async Task<IActionResult> GetByPatient(Guid id)
    {
        var result = await _panierRepo.GetPaniersByPatientAsync(id);
        return Ok(result);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPanierById(Guid id)
    {
        var panier = await _panierRepo.GetPanierByIdAsync(id);
        if (panier == null)
        {
            return NotFound(new { message = "Panier not found" });
        }
        return Ok(panier);
    }

    [HttpPost("validate/{panierId}")]
    public async Task<IActionResult> Validate(Guid panierId)
    {
        var result = await _panierRepo.ValidatePanierAsync(panierId);
        if (result == null)
            return NotFound("Panier not found.");
        return Ok(result);
    }

    [HttpPost("refresh-missing-meds")]
    public async Task<IActionResult> RefreshMissing()
    {
        await _panierRepo.RefreshAllPaniersMissingMedsAsync();
        return Ok(new { message = "All paniers updated." });
    }
}
