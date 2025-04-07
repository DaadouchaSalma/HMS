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
        
        [HttpGet("notifications/{patientId}")]
        public async Task<ActionResult<List<string>>> GetNotifications(Guid patientId)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Now);
            TimeOnly nowTime = TimeOnly.FromDateTime(DateTime.Now);

            var notifications = await _context.Rdv
                .Include(r => r.Medecin)
                .Where(r =>
                    r.etat == "En attente" &&
                    r.PatientId == patientId &&
                    r.Date_RDV >= today &&
                    (r.Date_RDV > today || r.Time_RDV > nowTime)
                )
                .Select(r => $"Rendez-vous avec Dr. {r.Medecin.Nom} le {r.Date_RDV} à {r.Time_RDV}.")
                .ToListAsync();

            return Ok(notifications);

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

        // POST: Take an appointment if the doctor is available
        /* [HttpPost("add")]
         public async Task<IActionResult> PrendreRendezVous([FromBody] RendezVous Rdv)
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
             Console.WriteLine($"User authenticated: {User.Identity.IsAuthenticated}");
             Console.WriteLine($"User ID: {_userManager.GetUserId(User)}");
             //Console.WriteLine($"User ID: {_patientRepository.GetByIdentityUserIdAsync(identityUserId)}");
             // Find the patient associated with the authenticated user
             var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
             if (patient == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }

             var disponibilites = await _rendezVousRepository.GetDisponibilitesAsync(Rdv.MedecinId, Rdv.Date_RDV, Rdv.Time_RDV);
             Console.WriteLine($"Disponibilité: {disponibilites.Count()}");
             foreach (var dispo in disponibilites)
             {
                 Console.WriteLine($"Disponibilité : {dispo.MedecinId},{dispo.Date_RDV},{dispo.Time_RDV}");
             }

             if (disponibilites.Any())
             {
                 return BadRequest(new { message = "Le médecin n'est pas disponible à cette date." });
             }

             var rendezVous = new RendezVous
             {
                 Id = Guid.NewGuid(),
                 Date_RDV = Rdv.Date_RDV,
                 Time_RDV = Rdv.Time_RDV,
                 etat = "En attente",
                 PatientId = patient.Id, // Assign the correct PatientId
                 MedecinId = Rdv.MedecinId
             };

             var createdRendezVous = await _rendezVousRepository.AddAsync(rendezVous);
             return Ok(createdRendezVous);
         }
        */
        /*[HttpPost("add")]
        public async Task<IActionResult> AddRendezVous([FromBody] RendezVous rdv)

        private readonly IRdvRepository _rendezVousRepository;

        public RdvController(IRdvRepository rendezVousRepository)
        {
            _rendezVousRepository = rendezVousRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddRendezVous([FromBody] RendezVous rdv)
        {
            try
            {
                /* if (!User.Identity.IsAuthenticated)
                 {
                     return Unauthorized(new { message = "Utilisateur non authentifié" });
                 }*/

                /* var identityUserId = _userManager.GetUserId(User);
                 if (string.IsNullOrEmpty(identityUserId))
                 {
                     return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
                 }

                 // Vérifier que le patient existe
                 var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
                 if (patient == null)
                 {
                     return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
                 }*/

                // Vérifier si le créneau est disponible
               /* var disponibilites = await _rendezVousRepository.GetHeuresDisponiblesAsync(rdv.MedecinId, rdv.Date_RDV);
                TimeOnly selectedTime = rdv.Time_RDV; // Pas besoin de conversion en string

                if (!disponibilites.Contains(selectedTime))
                {
                    return BadRequest(new { message = "Le médecin n'est pas disponible à cette heure." });
                }


                // Ajouter le rendez-vous
                //rdv.PatientId = patient.Id;
                await _rendezVousRepository.AddAsync(rdv);

                // Réponse sans boucle infinie
                var response = new
                {
                    rdv.Id,
                    rdv.Date_RDV,
                    rdv.Time_RDV,
                    rdv.etat,
                    rdv.PatientId,
                    /*Patient = new
                    {
                        patient.Id,
                        patient.Nom,
                        patient.Prenom,
                        patient.Grp_Sang,
                        patient.Email,
                        patient.Date_Naiss,
                        patient.Telephone,
                        patient.IdentityUserId
                    },*/
                    rdv.MedecinId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erreur interne : {ex.Message}" });
            }
        }*/
        
        [HttpPost("add")]
        //[Authorize(Roles = "Patient")]
        public async Task<IActionResult> AddRendezVous([FromBody] RendezVous rdv)
        {
            try
            {
               /* if (!User.Identity.IsAuthenticated)
                {
                    return Unauthorized(new { message = "Utilisateur non authentifié" });
                }*/

               /* var identityUserId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(identityUserId))
                {
                    return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
                }

                // Vérifier que le patient existe
                var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
                if (patient == null)
                {
                    return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
                }*/

                // Vérifier si le créneau est disponible
                var disponibilites = await _rendezVousRepository.GetHeuresDisponiblesAsync(rdv.MedecinId, rdv.Date_RDV);
                TimeOnly selectedTime = rdv.Time_RDV; // Pas besoin de conversion en string

                if (!disponibilites.Contains(selectedTime))
                {
                    return BadRequest(new { message = "Le médecin n'est pas disponible à cette heure." });
                }


                // Ajouter le rendez-vous
                //rdv.PatientId = patient.Id;
                await _rendezVousRepository.AddAsync(rdv);

                // Réponse sans boucle infinie
                var response = new
                {
                    rdv.Id,
                    rdv.Date_RDV,
                    rdv.Time_RDV,
                    rdv.etat,
                    rdv.PatientId,
                    /*Patient = new
                    {
                        patient.Id,
                        patient.Nom,
                        patient.Prenom,
                        patient.Grp_Sang,
                        patient.Email,
                        patient.Date_Naiss,
                        patient.Telephone,
                        patient.IdentityUserId
                    },*/
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
       // [Authorize(Roles = "Patient")]
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

        [HttpGet("patient/{patientId}")]
        //[Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMesRendezVous(Guid patientId)
        {
            /* if (!User.Identity.IsAuthenticated)
               {
                   return Unauthorized(new { message = "Utilisateur non authentifié" });
               }*/

            /* var identityUserId = _userManager.GetUserId(User);
             if (string.IsNullOrEmpty(identityUserId))
             {
                 return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });
             }

             // Vérifier que le patient existe
             var patient = await _patientRepository.GetByIdentityUserIdAsync(identityUserId);
             if (patient == null)
             {
                 return BadRequest(new { message = "Aucun patient trouvé pour cet utilisateur." });
             }*/
            //patient.Id
           

           
            var rendezVous = await _rendezVousRepository.GetRendezVousByPatientIdAsync(patientId);

            return Ok(rendezVous);
        }




        [HttpPost("addAttente")]
        public async Task<IActionResult> AjouterAListeAttente([FromBody] RendezVous rdv)
        {
            if (rdv.PatientId == null)
            {
                return BadRequest("PatientId is required");
            }

            await _listeAttenteRepository.AjouterPatientAListeAttente(rdv.PatientId.Value, rdv.MedecinId, rdv.Date_RDV);

            return Ok();

        }
    }
}

