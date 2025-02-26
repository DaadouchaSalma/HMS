namespace HMS.Models
{
    public class Med_Mat
    {
        private Guid Id { get; set; }
        private string Nom { get; set; }
        private string Description { get; set; }
        private int Nbr_stock { get; set; }
        private string Compagnie { get; set; }
        private DateTime Date_Exp { get;set; }

        public ICollection<FactureMedicament> FactureMedicaments { get; set; } = new List<FactureMedicament>();
    }
}
