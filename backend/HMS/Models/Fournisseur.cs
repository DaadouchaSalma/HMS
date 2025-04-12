namespace HMS.Models
{
    public class Fournisseur
    {
        public Guid Id { get; set; }

        public string NomF {  get; set; }
        public string Adresse { get; set; }
        public string numTel { get; set; }
        public string mail { get; set; }
        public ICollection<Medicament> Medicaments { get; set; } = new List<Medicament>();

    }
}
