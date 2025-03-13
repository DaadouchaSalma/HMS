namespace HMS.Models
{
    public class Medicament
    {
        public Guid Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public int Nbr_stock { get; set; }
        public string Compagnie { get; set; }
        public DateOnly Date_Exp { get;set; }

        public ICollection<Facture> Factures { get; set; } = new List<Facture>();
    }
}
