namespace HMS.Models
{
    public class PatientDTO
    {
        public Guid PatientId { get; set; }
        public string GroupeSanguin { get; set; }
        public DateOnly DateNaissance { get; set; }
        public string Sexe { get; set; }
    }
}
