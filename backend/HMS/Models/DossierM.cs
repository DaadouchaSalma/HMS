namespace HMS.Models
{
    public class DossierM
    {
        public Guid Id { get; set; }
        public List<string> liste_pres {  get; set; }
        public List<string> liste_analyse { get; set; }
        public List<RendezVous> liste_rdv { get; set; }

        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
