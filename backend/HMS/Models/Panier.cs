using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Panier
    {
        public Guid Id { get; set; } // Unique ID for the cart
        [ForeignKey("Patient")]
        public Guid PatientId { get; set; } // Reference to the User who owns the cart
        [JsonIgnore]
        public Patient Patient { get; set; }
        public ICollection<MedPanier> medPaniers { get; set; } = new List<MedPanier>();

        // Store as a JSON string in NVARCHAR(MAX)
        [Column(TypeName = "nvarchar(max)")]
        public string MissingMedsJson { get; set; } = "[]";

        [NotMapped] // Not mapped directly to the database
        public List<MedicamentDTO> MissingMeds
        {
            get => string.IsNullOrEmpty(MissingMedsJson)
                ? new List<MedicamentDTO>()
                : JsonSerializer.Deserialize<List<MedicamentDTO>>(MissingMedsJson) ?? new List<MedicamentDTO>();

            set => MissingMedsJson = JsonSerializer.Serialize(value);
        }
    }

}

