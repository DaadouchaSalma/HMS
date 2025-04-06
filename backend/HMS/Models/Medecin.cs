using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HMS.Models
{
    [Table("Medecins")]
    public class Medecin : Personnel
    {
        public string? Grad_med {  get; set; }
        public string? service {  get; set; }
        [JsonIgnore]
        public ICollection<RendezVous> RendezVous { get; set; } = new List<RendezVous>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}
