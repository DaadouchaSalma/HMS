namespace HMS.Models
{
    public class DossierM
    {
        private Guid Id { get; set; }
        private List<string> liste_pres {  get; set; }
        private List<string> liste_analyse { get; set; }
        private List<RendezVous> liste_rdv { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
