using HMS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class FactureController : ControllerBase
    {
        private readonly FactureService _factureService;
        private readonly GenererFacture _generateurPDF;
        private readonly ApplicationDbContext _context;

        public FactureController(FactureService factureService, ApplicationDbContext context)
        {
            _factureService = factureService;
            _generateurPDF = new GenererFacture();
            _context = context;
        }

        [HttpPost("generer/{factureId}")]
        public async Task<IActionResult> GenererFacture(Guid factureId)
        {
            /*try
            {
                var facture = await _factureService.GenererFactureAsync(patientId);
                /*var pdfBytes = _generateurPDF.GenererFacturePDF(facture);
                return File(pdfBytes, "application/pdf", "Facture.pdf");*/
            /*return Ok(facture);


        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }*/
            {
                var facture = await _context.Factures
                    .Include(f => f.Patient)
                    .Include(f => f.Admission).ThenInclude(a => a.Chambre)
                    .Include(f => f.MedicamentsDetails)
                    .FirstOrDefaultAsync(f => f.Id == factureId);

                if (facture == null)
                    return NotFound("Facture introuvable.");

                return Ok(facture);

            }
        }
    }
}


