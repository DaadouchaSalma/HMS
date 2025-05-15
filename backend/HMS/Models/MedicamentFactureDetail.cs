namespace HMS.Models
{

    public class MedicamentFactureDetail
    {
        public Guid Id { get; set; }
        public string Nom { get; set; }
        public int Quantite { get; set; }
        public float PrixUnitaire { get; set; }
        public float Total => Quantite * PrixUnitaire;
    }

}
