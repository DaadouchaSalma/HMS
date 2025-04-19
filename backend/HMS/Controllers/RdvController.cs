using System.Runtime.Intrinsics.Arm;
using System.Security.Claims;
using HMS.Interfaces;
using HMS.Models;
using HMS.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
    
{
    [Route("api/rendezvous")]
    [ApiController]
    public class RdvController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IRdvRepository _rendezVousRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly ListeAttenteRepository _listeAttenteRepository;

         public RdvController(IRdvRepository rendezVousRepository, UserManager<ApplicationUser> userManager, IPatientRepository patientRepository, IEmailService emailService, ListeAttenteRepository listeAttenteRepository,ApplicationDbContext context)
        {
            _rendezVousRepository = rendezVousRepository;
            _userManager = userManager;
            _patientRepository = patientRepository;
            _emailService = emailService;
            _listeAttenteRepository = listeAttenteRepository;
             _context = context;
        }
        [Authorize(Roles = "Patient")]
        [HttpGet("notifications")]
        public async Task<ActionResult<List<string>>> GetNotifications()
        {
            try
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
                DateOnly today = DateOnly.FromDateTime(DateTime.Now);
                TimeOnly nowTime = TimeOnly.FromDateTime(DateTime.Now);

                var notifications = await _context.Rdv
                    .Include(r => r.Medecin)
                    .Where(r =>
                        r.etat == "En attente" &&
                        r.PatientId == patient.Id &&
                        r.Date_RDV >= today &&
                        (r.Date_RDV > today || r.Time_RDV > nowTime)
                    )
                    .Select(r => $"Rendez-vous avec Dr. {r.Medecin.Nom} le {r.Date_RDV} à {r.Time_RDV}.")
                    .ToListAsync();

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

       
        // GET: Get all appointments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rendezVousList = await _rendezVousRepository.GetAllAsync();
            return Ok(rendezVousList);
        }

        // GET: Get appointment by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var rendezVous = await _rendezVousRepository.GetByIdAsync(id);
            if (rendezVous == null) return NotFound();
            return Ok(rendezVous);
        }

        
        [HttpPost("add")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> AddRendezVous([FromBody] RendezVous rdv)
        {
            try
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

                // Vérifier que le patient existe
                var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
                if (patient == null)
                {
                    return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
                }

                // Vérifier si le créneau est disponible
                var disponibilites = await _rendezVousRepository.GetHeuresDisponiblesAsync(rdv.MedecinId, rdv.Date_RDV);
                TimeOnly selectedTime = rdv.Time_RDV; // Pas besoin de conversion en string

                if (!disponibilites.Contains(selectedTime))
                {
                    return BadRequest(new { message = "Le médecin n'est pas disponible à cette heure." });
                }
                var existingRdv = await _rendezVousRepository
        .ExistsRendezVousAsync(patient.Id, rdv.MedecinId, rdv.Date_RDV);

                if (existingRdv)
                {
                    return BadRequest(new { message = "Vous avez déjà un rendez-vous avec ce médecin à cette date." });
                }

                // Ajouter le rendez-vous
                rdv.PatientId = patient.Id;
                await _rendezVousRepository.AddAsync(rdv);

                // Réponse sans boucle infinie
                var response = new
                {
                    rdv.Id,
                    rdv.Date_RDV,
                    rdv.Time_RDV,
                    rdv.etat,
                    rdv.PatientId,
                    Patient = new
                    {
                        patient.Id,
                        patient.Nom,
                        patient.Prenom,
                        patient.Grp_Sang,
                        patient.Email,
                        patient.Date_Naiss,
                        patient.Telephone,
                        patient.IdentityUserId
                    },
                    rdv.MedecinId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur interne : {ex.Message}" });
            }
        }


        [HttpGet("disponibilites")]
        public async Task<IActionResult> GetDisponibilites([FromQuery] Guid medecinId, [FromQuery] DateOnly date_RDV)
        {
            if (date_RDV == default)
                return BadRequest("Médecin ou date invalide.");

            var heuresDisponibles = await _rendezVousRepository.GetHeuresDisponiblesAsync(medecinId, date_RDV);

            return Ok(heuresDisponibles);
        }


        // PUT: Update appointment status
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRendezVous(Guid id, [FromBody] RendezVous rendezVous)
        {
            if (id != rendezVous.Id)
                return BadRequest("L'ID ne correspond pas.");

            await _rendezVousRepository.UpdateAsync(rendezVous);
            return NoContent();
        }

        // DELETE: Cancel an appointment
        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> DeleteRendezVous(Guid id)
        {
            // First get the appointment being deleted
            var rendezVous = await _rendezVousRepository.GetByIdAsync(id);
            if (rendezVous == null)
            {
                return NotFound();
            }

            // Delete the appointment
            await _rendezVousRepository.DeleteAsync(id);

            // Check waiting list for this doctor/date
            await _listeAttenteRepository.NotifyPatientsInWaitingList(rendezVous.MedecinId, rendezVous.Date_RDV);
            
            return NoContent();
        }

        [HttpGet("patient")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMesRendezVous()
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

             // Vérifier que le patient existe
             var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
             if (patient == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }
            //patient.Id
           

           
            var rendezVous = await _rendezVousRepository.GetRendezVousByPatientIdAsync(patient.Id);

            return Ok(rendezVous);
        }




        [HttpPost("addAttente")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> AjouterAListeAttente([FromBody] RendezVous rdv)
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

            // Vérifier que le patient existe
            var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
            if (patient == null)
            {
                return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
            }
            //patient.Id


            await _listeAttenteRepository.AjouterPatientAListeAttente(patient.Id, rdv.MedecinId, rdv.Date_RDV);

            return Ok();

        }
    }
}

