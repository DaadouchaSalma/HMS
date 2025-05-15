using HMS.Interfaces;
using HMS.Models;

namespace HMS.Services
{
    public class FactureService
    {
        private readonly IFactureRepository _repository;
        private readonly ApplicationDbContext _context;

        public FactureService(IFactureRepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<Facture> GenererFactureAsync(Guid admissionId)
        {
            var admission =await  _context.Admissions.FindAsync(admissionId);
            /*var admission = await _repository.GetAdmissionAvecChambreAsync(patientId);*/
            if (admission == null)
                throw new Exception("Admission non trouvée ou en cours.");

            var jours = (admission.DateSortie.Value.Date - admission.DateAdmission.Date).Days;
            Console.WriteLine("nb jours:"+ jours);
            float prixJournalier = CalculerTarifJournalier(admission.Chambre);
            float totalChambre = jours * prixJournalier;

            var paniers = await _repository.GetPaniersValidésAsync(admission.PatientId, admission.DateAdmission, admission.DateSortie.Value);

            float totalMedicaments = 0;
            var details = new List<MedicamentFactureDetail>();
            Console.WriteLine("paniers:" + paniers.Count());
            foreach (var panier in paniers)
            {
                Console.WriteLine("paniers:" + panier);
                foreach (var med in panier.medPaniers)
                {
                    float total = med.quantity * med.Medicament.prix;
                    totalMedicaments += total;

                    details.Add(new MedicamentFactureDetail
                    {
                        Nom = med.Medicament.Nom,
                        Quantite = med.quantity,
                        PrixUnitaire = med.Medicament.prix
                    });
                }
            }
            var patient = await _repository.GetPatientByIdAsync(admission.PatientId);
            if (patient == null)
                throw new Exception("Patient introuvable.");


            var facture = new Facture
            {
                PatientId = admission.PatientId,
                AdmissionId = admission.Id,
                Patient=patient,
                Admission=admission,
                TotalChambre = totalChambre,
                TotalMedicaments = totalMedicaments,
                MedicamentsDetails = details
            };

            await _repository.AjouterFactureAsync(facture);
            await _repository.SaveChangesAsync();

            return facture;
        }

        private float CalculerTarifJournalier(Chambre chambre)
        {
            float tarifBase = chambre.Niveau_dequipement switch
            {
                "Basique" => 100,
                "Médicalisé" => 150,
                "Soins intensifs" => 300,
                _ => 80
            };

            float facteurLit = chambre.Nb_lit switch
            {
                1 => 1.0f,
                2 => 0.75f,
                3 => 0.5f,
                _ => 1.0f
            };

            return tarifBase * facteurLit;
        }
    }

}
