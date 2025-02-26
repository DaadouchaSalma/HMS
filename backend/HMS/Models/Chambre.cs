namespace HMS.Models
{
    public class Chambre
    {
        private Guid Id { get; set; }
        private int Nb_lit {  get; set; }
        private string statut {  get; set; }

        public ICollection<Patient> Patients { get; set; } = new List<Patient>();
    }
}
