using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class MedicamentDTO
    {
        public string ID { get; set; }

        [JsonPropertyName("nom")]
        public string Nom { get; set; }

        [JsonPropertyName("dosage")]
        public string Dosage { get; set; }

        [JsonPropertyName("quantite")]
        public int Quantite { get; set; }

        [JsonPropertyName("frequence")]
        public string Frequence { get; set; }

        [JsonPropertyName("duree")]
        public string Duree { get; set; }

        [JsonPropertyName("voieAdministration")]
        public string VoieAdministration { get; set; }

        [JsonPropertyName("InstructionsSpeciales")]
        public string InstructionsSpeciales { get; set; }
    }

}
