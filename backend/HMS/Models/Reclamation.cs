using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Reclamation
    {
        
            public Guid Id { get; set; }  
            public Guid ChambreId { get; set; }  
            public Guid PatientId { get; set; }  

            public string TypeProbleme { get; set; } 
            public string Description { get; set; }
            
            public DateTime DateSoumission { get; set; } = DateTime.Now;
        [JsonIgnore]
            public Chambre? Chambre { get; set; }
            public Patient? Patient { get; set; }
        }
    }



