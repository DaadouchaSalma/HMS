using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace HMS.Models
{
    public class DossierM
    {
        public Guid Id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long matricule { get; set; }
        public string? sexe { get; set; }
        public List<string>? maladies_anterieures { get; set; }
        public List<string>? maladies_familiaux { get; set; }
        public List<string>? chirurgies { get; set; }
        public List<string>? allergies { get; set; }
        public List<string>? vaccinations { get; set; }
        public List<string>? contact_urg { get; set; }
        public List<string>? note { get; set; }
        public List<string>? liste_analyse { get; set; }
        public Guid PatientId { get; set; }
        [JsonIgnore]
        public Patient? Patient { get; set; }
        public DossierM()
        {
            Random rnd = new Random();
            matricule = rnd.Next(100000000, 999999999); 
        }
    }
}
