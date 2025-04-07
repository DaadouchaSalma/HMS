namespace HMS.Models
{
    public class DossierM
    {
        public Guid Id { get; set; }
        public long matricule { get; set; }
        public string sexe { get; set; }
        public List<string> maladies_antérieures { get; set; }
        public List<string> maladies_familiaux { get; set; }
        public List<string> chirurgies { get; set; }
        public List<string> allergies { get; set; }
        public List<string> vaccinations { get; set; }
        public List<string> contact_urg { get; set; }
        public List<string> note { get; set; }
       
        public string liste_analyse { get; set; }
        

        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
