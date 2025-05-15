using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Facture
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid PatientId { get; set; }
        public Patient? Patient { get; set; }

        public DateTime DateFacture { get; set; } = DateTime.Now;

        public float TotalMedicaments { get; set; }
        public float TotalChambre { get; set; }
        public float TotalGeneral => TotalMedicaments + TotalChambre;

        public Guid AdmissionId { get; set; }
        [JsonIgnore]
        public Admission? Admission { get; set; }

        public String status { get; set; } = "En attente";

        //public List<MedicamentFactureDetail> MedicamentsDetails { get; set; } = new();
    }

}