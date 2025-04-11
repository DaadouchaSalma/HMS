using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
    
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdmissionController: Controller
    {

    private readonly ApplicationDbContext _context;

        public AdmissionController(ApplicationDbContext context)
    {
        _context = context;
    }
        [Authorize(Roles = "PersonnelAdministratif")]
        [HttpPost]
        public IActionResult AddAdmission([FromBody] Admission admission)
        {
            if (admission == null) return BadRequest("Données invalides.");

            // Vérifier l'existence de la chambre et du patient
            var chambre = _context.Chambres.FirstOrDefault(c => c.Id == admission.ChambreId);
            var patient = _context.Patients.FirstOrDefault(p => p.Id == admission.PatientId);

            if (chambre == null) return BadRequest("Chambre introuvable.");
            if (patient == null) return BadRequest("Patient introuvable.");

            // Associer les objets
            admission.Chambre = chambre;
            admission.Patient = patient;
            admission.Statut = "en cours";

            // Mettre à jour l'état de la chambre
            chambre.statut = "Occupée";

            _context.Admissions.Add(admission);
            _context.SaveChanges();

            return Ok();
        }

        //listePatients
        [HttpGet("patients")]
        public IActionResult GetPatients()
        {
            var patients = _context.Patients.Select(p => new
            {
                p.Id,
                p.Nom,
                p.Prenom,
                p.Date_Naiss
            }).ToList();

            return Ok(patients);
        }

        //listeChambreDispo

        [HttpGet("chambres/disponibles")]
        public IActionResult GetChambresDisponibles(string service, string niveauEquipement)
        {
            var chambres = _context.Chambres.Where(c => c.Services == service && c.Niveau_dequipement == niveauEquipement && c.statut == "Disponible").ToList();
            return Ok(chambres);
        }

        //sortiePatient
        [Authorize(Roles = "PersonnelAdministratif")]
        [HttpPost("sortie/{admissionId}")]
        public IActionResult SortiePatient(Guid admissionId)
        {
            var admission = _context.Admissions.FirstOrDefault(a => a.Id == admissionId);
            if (admission == null) return NotFound("Admission introuvable.");

            // Mettre à jour l'admission
            admission.Statut = "Terminée";
            admission.DateSortie = DateTime.Now; 

            // Libérer la chambre
            var chambre = _context.Chambres.FirstOrDefault(c => c.Id == admission.ChambreId);
            if (chambre != null)
            {
                chambre.statut = "Disponible";
            }

            _context.SaveChanges();
            return Ok();
        }

        //liste des admissionEnCours
        [Authorize(Roles = "PersonnelAdministratif")]
        [HttpGet("listeAdmission")]
        public IActionResult GetAdmission()
        {
            var admissions = _context.Admissions
        .Include(a => a.Patient)
        .Include(a => a.Chambre)
        .Where(a => a.Statut == "En cours") // Filtrer les admissions actives
        .Select(a => new
        {
            a.Id,
            a.PatientId,
            a.ChambreId,
            a.Patient.Nom,
            a.Patient.Prenom,
            a.Patient.Date_Naiss,
            a.Chambre.NumeroChambre,
            a.DateAdmission
        })
        .ToList();

            return Ok(admissions);
        }

    }
}
