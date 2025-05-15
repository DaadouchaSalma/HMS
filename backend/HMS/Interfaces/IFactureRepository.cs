using HMS.Models;

namespace HMS.Interfaces
{
    public interface IFactureRepository
    {
        /*Task<Admission?> GetAdmissionAvecChambreAsync(Guid patientId);*/
        Task<List<Panier>> GetPaniersValidésAsync(Guid patientId, DateTime dateDebut, DateTime dateFin);
        Task AjouterFactureAsync(Facture facture);
        Task SaveChangesAsync();
        Task<Patient?> GetPatientByIdAsync(Guid patientId);
    }
}
