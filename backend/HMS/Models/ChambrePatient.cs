namespace HMS.Models
{
    public class ChambrePatient
    {
        public Guid ChambreId { get; set; }
        public Chambre Chambre { get; set; }

        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
