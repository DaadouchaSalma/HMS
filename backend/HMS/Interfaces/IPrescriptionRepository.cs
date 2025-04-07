using HMS.Models;

namespace HMS.Interfaces
{
    public interface IPrescriptionRepository
    {
        Task<Prescription> AddPrescriptionAsync(Prescription prescription);

        Task<Prescription> GetPrescriptionByIdAsync(Guid id);
    }
}
