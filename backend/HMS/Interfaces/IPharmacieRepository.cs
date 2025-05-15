using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Interfaces
{
    public interface IPharmacieRepository
    {
        Pharmacien GetById(Guid id);
        void Update(Pharmacien medecin);
        void Save();

        Task<IEnumerable<Pharmacien>> GetAll();
        Task Add(Pharmacien pharmacien);
        Task SaveAsync();

        Task<Pharmacien?> GetByIdAsync(Guid id);

        void Delete(Pharmacien pharmacien);
        Task<Pharmacien> GetByIdentityUserIdAsync(string identityUserId);
        Task<int> CountAsync();

    }
}
