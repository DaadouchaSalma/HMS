namespace HMS.Models
{
    public class Personnel
    {
        public Guid Id {  get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateOnly Date_Naiss { get; set; }
        public DateOnly Date_Emb {  get; set; }
        public double Salaire { get; set; }
        public long Telephone { get; set; }
        public TypePersonnel Type { get; set; }
        public string? Adresse { get; set; }
        public string? Statut { get; set; }
    }
}
