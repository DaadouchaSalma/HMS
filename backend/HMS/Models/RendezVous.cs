namespace HMS.Models
{
    public class RendezVous
    {
        public Guid Id { get; set; }
        public DateTime Date_RDV { get; set; }
        public string etat {  get; set; }

        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }

        public Guid MedecinId { get; set; }
        public Medecin Medecin { get; set; }
    }
}
