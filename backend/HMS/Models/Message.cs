using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public Guid ExpediteurId { get; set; }
        [JsonIgnore]
        public Personnel? Expediteur { get; set; }
        public Guid DestinataireId { get; set; }
        [JsonIgnore]
        public Personnel? Destinataire { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
