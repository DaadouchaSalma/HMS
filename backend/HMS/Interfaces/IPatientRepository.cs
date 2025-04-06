using HMS.Models;

namespace HMS.Interfaces
{
    public interface IPatientRepository
    {
         Task<Patient> GetByIdAsync(Guid id);
        Task<Patient> GetByIdentityUserIdAsync(string identityUserId);
    }
}
