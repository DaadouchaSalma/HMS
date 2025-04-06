using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class RendezVous
    {
        public Guid Id { get; set; }
        public DateOnly Date_RDV { get; set; }
        public TimeOnly Time_RDV { get; set; }
        public string etat {  get; set; } = "En attente";
        public Guid? PatientId { get; set; }
        public Patient? Patient { get; set; }
        public Guid MedecinId { get; set; }
        public Medecin? Medecin { get; set; }
    }
}