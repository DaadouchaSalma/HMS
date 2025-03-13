namespace HMS.Models
{
    public class Chambre
    {
        public Guid Id { get; set; }
        public int NumeroChambre { get; set; }
        public int etage { get; set; }
        public string Niveau_dequipement { get; set; }  
        public string Services { get; set; }
        public int Nb_lit {  get; set; }
        public string statut {  get; set; }

        public ICollection<Patient> Patients { get; set; } = new List<Patient>();
    }
}
