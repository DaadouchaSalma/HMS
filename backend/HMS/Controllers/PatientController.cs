using System.Collections;
using HMS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public PatientController(ApplicationDbContext context, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        /*[HttpPost("new")]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (patient == null)
            {
                return BadRequest("Patient data is required.");
            }

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient ajouté avec succès" });
        }*/

        [HttpPost("new")]
        public async Task<IActionResult> AjouterPatient([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Nom = model.Nom,
                Prenom = model.Prenom,
               // Role = "Patient"
            };

            

            var patient = new Patient
            {
                Id = Guid.NewGuid(),
                Nom = model.Nom,
                Prenom = model.Prenom,
                Email = model.Email,
                Date_Naiss = model.Date_Naiss,
                Telephone = model.Telephone,
                Grp_Sang = model.Grp_Sang,
                IdentityUserId = user.Id
            };
            user.PatientId = patient.Id;
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Patient");
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient ajouté avec succès" });
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] Patient updatedPatient)
        {
            if (updatedPatient == null || id != updatedPatient.Id)
            {
                return BadRequest("Invalid patient data.");
            }

            var existingPatient = await _context.Patients.FindAsync(id);
            if (existingPatient == null)
            {
                return NotFound("Patient not found.");
            }

            existingPatient.Nom = updatedPatient.Nom;
            existingPatient.Prenom = updatedPatient.Prenom;
            existingPatient.Grp_Sang = updatedPatient.Grp_Sang;
            existingPatient.Email = updatedPatient.Email;
            //existingPatient.Password = updatedPatient.Password;
            existingPatient.Date_Naiss = updatedPatient.Date_Naiss;
            existingPatient.Telephone = updatedPatient.Telephone;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(Guid id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            return Ok(patient);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _context.Patients.ToListAsync();

            if (!patients.Any())
            {
                return NotFound("No patients.");
            }

            return Ok(patients);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
