using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Interfaces
{
    public interface IAdminRepository
    {
        PersonnelAdministrative GetById(Guid id);
        void Update(PersonnelAdministrative personnelAdministrative);
        void Save();

        Task<IEnumerable<PersonnelAdministrative>> GetAll();
        Task Add(PersonnelAdministrative personnelAdministrative);
        Task SaveAsync();

        Task<PersonnelAdministrative?> GetByIdAsync(Guid id);

        void Delete(PersonnelAdministrative personnelAdministrative);

        Task<PersonnelAdministrative> GetByIdentityUserIdAsync(string identityUserId);
        
    }
}
