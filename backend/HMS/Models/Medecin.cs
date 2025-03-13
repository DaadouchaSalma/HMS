using System.ComponentModel.DataAnnotations.Schema;

namespace HMS.Models
{
    [Table("Medecins")]
    public class Medecin : Personnel
    {
        public string Grad_med {  get; set; }
        public string service {  get; set; }
        public ICollection<RendezVous> RendezVous { get; set; } = new List<RendezVous>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}
