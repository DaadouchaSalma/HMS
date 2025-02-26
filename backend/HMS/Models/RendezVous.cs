namespace HMS.Models
{
    public class RendezVous
    {
        private Guid Id { get; set; }
        private DateTime Date_RDV { get; set; }
        private string etat {  get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
