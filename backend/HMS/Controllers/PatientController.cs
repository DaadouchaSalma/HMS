using System.Collections;
using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IPatientRepository _patientRepository;

        public PatientController(ApplicationDbContext context, UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager, IPatientRepository patientRepository )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _patientRepository = patientRepository;
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

        [Authorize(Roles = "Medecin, PersonnelAdministratif")]
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
                Password = model.Password,
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

            return Ok(patient);
        }

        [Authorize(Roles = "Patient")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdatePatient([FromBody] Patient updatedPatient)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié" });
            }
            

             var identityUserId = _userManager.GetUserId(User);
             if (string.IsNullOrEmpty(identityUserId))
             {
                 return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
             }

             var existingPatient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
             if (existingPatient == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }

            if (updatedPatient == null)
            {
                return BadRequest("Invalid patient data.");
            }

            existingPatient.Nom = updatedPatient.Nom;
            existingPatient.Prenom = updatedPatient.Prenom;
            existingPatient.Grp_Sang = updatedPatient.Grp_Sang;
            existingPatient.Email = updatedPatient.Email;
            existingPatient.Password = updatedPatient.Password;
            existingPatient.Date_Naiss = updatedPatient.Date_Naiss;
            existingPatient.Telephone = updatedPatient.Telephone;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("me")]
        public async Task<IActionResult> GetPatientById()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié" });
            }

            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
            {
                return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
            }

            var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);

            if (patient == null)
            {
                return NotFound(new { message = "Aucun patient trouvé pour cet utilisateur." });
            }

            return Ok(patient);
        }

        [Authorize(Roles = "Medecin, PersonnelAdministratif, Pharmacien, Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _context.Patients.Include(p => p.DossierMedical).ToListAsync();

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
