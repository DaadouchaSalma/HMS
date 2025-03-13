namespace HMS.Models
{
    public class Patient
    {
        public Guid Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public long Telephone { get; set; }
        public string Email { get; set; }
        public DateOnly Date_Naiss { get; set; }
        public string Grp_Sang { get; set; }


        public ICollection<RendezVous> RendezVous { get; set; } = new List<RendezVous>();
        public Facture Facture { get; set; }
        public DossierM DossierMedical { get; set; }
        public ICollection<Chambre> Chambres { get; set; } = new List<Chambre>();

    }
}
