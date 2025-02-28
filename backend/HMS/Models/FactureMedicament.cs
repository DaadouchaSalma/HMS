namespace HMS.Models
{

    public class FactureMedicament
    {
        public Guid FactureId { get; set; }
        public Facture Facture { get; set; }

        public Guid MedicamentId { get; set; }
        public Medicament Medicament { get; set; }

        public int Quantite { get; set; }
    }
}
