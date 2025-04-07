using System.Text.Json.Serialization;


namespace HMS.Models
{
    public class Patient
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Grp_Sang { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateOnly Date_Naiss { get; set; }
        public long Telephone { get; set; }

        public string? IdentityUserId { get; set; }
        public ApplicationUser? IdentityUser { get; set; }

        public ICollection<RendezVous>? RendezVous { get; set; } = new List<RendezVous>();
        public Facture? Facture { get; set; }
        public DossierM? DossierMedical { get; set; }
        public ICollection<Prescription>? Prescriptions { get; set; } = new List<Prescription>();
        public ICollection<Chambre>? Chambres { get; set; } = new List<Chambre>();
        [JsonIgnore]

        public ICollection<Panier> Paniers { get; set; } = new List<Panier>();

        public ICollection<Reclamation> Reclamations { get; set; } = new List<Reclamation>();


    }
}
