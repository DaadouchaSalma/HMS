namespace HMS.Models
{
    public class CategorieMedicament
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<Medicament> Medicaments { get; set; } = new List<Medicament>();

    }
}
