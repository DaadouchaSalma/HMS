namespace HMS.Models
{
    public class Facture 
    {
        public Guid Id { get; set; }
        public double Prix_admission {  get; set; }
        public double Prix_medecin { get; set; }
        public double Prix_medicament {  get; set; }
        public double Prix_materiel {  get; set; }

        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public ICollection<Medicament> Medicaments { get; set; } = new List<Medicament>();
    }
}
