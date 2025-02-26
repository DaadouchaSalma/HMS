namespace HMS.Models
{
    public class Personnel
    {
        private Guid Id {  get; set; }
        private string Nom { get; set; }
        private string Prenom { get; set; }
        private string Email { get; set; }
        private string Password { get; set; }
        private DateOnly Date_Naiss { get; set; }
        private DateOnly Date_Emb {  get; set; }
        private double Salaire { get; set; }

    }
}
