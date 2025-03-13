using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using HMS.Interfaces;
using HMS.Repositories;
using Newtonsoft.Json;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : Controller
    {
        private readonly IPrescriptionRepository _prescriptionRepository;

        public PrescriptionController(IPrescriptionRepository prescriptionRepository)
        {
            _prescriptionRepository = prescriptionRepository;
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddPrescription([FromBody] Prescription prescription)
        {

            if (prescription == null)
            {
                return BadRequest("Prescription data is required.");
            }

            try
            {
                prescription.ListeMed = JsonConvert.SerializeObject(prescription.ListeMed);
                await _prescriptionRepository.AddPrescriptionAsync(prescription);
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
