using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Panier
    {
        public Guid Id { get; set; } 
        [ForeignKey("Patient")]
        public Guid PatientId { get; set; } 
        [JsonIgnore]
        public Patient Patient { get; set; }
        public string state { get; set; } = "courant";
        public DateTime? DateValidation { get; set; }
        public ICollection<MedPanier> medPaniers { get; set; } = new List<MedPanier>();

        
        [Column(TypeName = "nvarchar(max)")]
        public string MissingMedsJson { get; set; } = "[]";

        [NotMapped] 
        public List<MedicamentDTO> MissingMeds
        {
            get => string.IsNullOrEmpty(MissingMedsJson)
                ? new List<MedicamentDTO>()
                : JsonSerializer.Deserialize<List<MedicamentDTO>>(MissingMedsJson) ?? new List<MedicamentDTO>();

            set => MissingMedsJson = JsonSerializer.Serialize(value);
        }

        
    }

}

