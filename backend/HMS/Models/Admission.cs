using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Admission

    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ChambreId { get; set; }
        public virtual Chambre? Chambre { get; set; }
        

        public Guid PatientId { get; set; }
        public virtual Patient? Patient { get; set; }


        public DateTime DateAdmission { get; set; }
        public DateTime? DateSortie { get; set; } 
        public string? Statut { get; set; } 
        public string Motif { get; set; }
        [JsonIgnore]
        public Facture? Facture { get; set; }
    }
}
