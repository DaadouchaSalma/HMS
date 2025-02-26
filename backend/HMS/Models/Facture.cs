namespace HMS.Models
{
    public class Facture 
    {
        private Guid Id { get; set; }
        private double Prix_admission {  get; set; }
        private double Prix_medecin { get; set; }
        private double Prix_medicament {  get; set; }
        private double Prix_materiel {  get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public ICollection<FactureMedicament> FactureMedicaments { get; set; } = new List<FactureMedicament>();
    }
}
