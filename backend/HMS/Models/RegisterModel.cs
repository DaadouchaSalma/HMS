using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class RegisterModel
    {
        // Common Fields for All Users
        [Required] public string Nom { get; set; }
        [Required] public string Prenom { get; set; }
        [Required][EmailAddress] public string Email { get; set; }
        [Required][DataType(DataType.Password)] public string Password { get; set; }
        //[Required] public string Role { get; set; } 

        public DateOnly Date_Naiss { get; set; }
        public long Telephone { get; set; }
       

        // Fields Specific to Patients
        public string? Grp_Sang { get; set; } 

        // Fields Specific to Personnel (Medecin, Pharmacien, Administratif)
        public DateOnly? Date_Emb { get; set; } 
        public double? Salaire { get; set; }
        public string? Adresse { get; set; }
        public string? Statut { get; set; }

        // Fields Specific to Medecins
        public string? Grad_med { get; set; } 
        public string? Service { get; set; } 
    }
}
