using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class MedPanier
    {
        public Guid Id { get; set; }
        public int quantity { get; set; }
        public Guid medicamentID { get; set; }
        public Medicament? Medicament { get; set; }
        public Guid PanierId { get; set; }
        [JsonIgnore]

        public Panier? panier { get; set; }
    }
}
