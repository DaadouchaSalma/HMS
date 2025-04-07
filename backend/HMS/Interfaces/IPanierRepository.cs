using HMS.Models;
using System;
using System.Threading.Tasks;

namespace HMS.Repositories
{
    public interface IPanierRepository
    {

        Task<Panier> AddToPanierAsync(Prescription prescription);
        Task<List<object>> GetAllPaniersAsync();
        Task<Panier> GetPanierByIdAsync(Guid panierId);
        Task<List<Panier>> GetPaniersByPatientAsync(Guid patientId);
        Task<object> ValidatePanierAsync(Guid panierId);
        Task RefreshAllPaniersMissingMedsAsync();
        Task MarkMedicamentAsMissingInPaniersAsync(Guid medicamentId);
    }
}
