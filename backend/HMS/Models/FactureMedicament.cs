namespace HMS.Models
{

    public class FactureMedicament
    {
        public int FactureId { get; set; }
        public Facture Facture { get; set; }

        public int MedicamentId { get; set; }
        public Med_Mat Medicament { get; set; }

        public int Quantite { get; set; }
    }
}
