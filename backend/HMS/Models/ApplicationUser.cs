using Microsoft.AspNetCore.Identity;
namespace HMS.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        //public string Role { get; set; } 
        public Guid? PersonnelId { get; set; } 
        public Guid? PatientId { get; set; }
    }
}
