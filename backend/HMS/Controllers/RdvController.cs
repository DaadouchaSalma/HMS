using HMS.Models;
using Microsoft.AspNetCore.Mvc;
using HMS.Repositories;
using HMS.Interfaces;

namespace HMS.Controllers
{
    [Route("api/rendezvous")]
    [ApiController]
    public class RdvController : Controller
    {

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
        public IActionResult Index()
        {
            return View();
        }
    }
}
