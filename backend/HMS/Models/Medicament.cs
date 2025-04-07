using System.Text.Json.Serialization;

namespace HMS.Models
{
    public class Medicament
    {
        public Guid Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public int Nbr_stock { get; set; }
        public DateOnly Date_Exp { get;set; }
        public float prix {  get; set; }

        public ICollection<Facture> Factures { get; set; } = new List<Facture>();
        public Guid FournisseurId { get; set; }
        [JsonIgnore]
        public Fournisseur? fournisseur { get; set; }
        public Guid CategorieId { get; set; }
        [JsonIgnore]
        public CategorieMedicament? categorie { get; set; }

    }
}
