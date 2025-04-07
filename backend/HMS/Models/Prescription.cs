using System.ComponentModel.DataAnnotations.Schema;

namespace HMS.Models
{
    public class Prescription
    {
        public Guid Id { get; set; }
        public string ListeMed { get; set; }
        public string Note { get; set; }
        public Guid MedecinId { get; set; }
        public Medecin? Medecin { get; set; }
        public Guid PatientId { get; set; }
        public Patient? Patient { get; set; }
        public DateTime Dateprescription { get; set; } = DateTime.Now;

    }
}
