using HMS.Models;

namespace HMS.Interfaces
{
    public interface IPatientRepository
    {
        Task<Patient> GetByIdentityUserIdAsync(string identityUserId);
    }
}
