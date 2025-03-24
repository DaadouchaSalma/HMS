using HMS.Models;

namespace HMS.Interfaces
{
    public interface IFournisseur
    {
        Task<IEnumerable<Fournisseur>> GetAllAsync();
        Task<Fournisseur> GetByIdAsync(Guid id);
        Task<Fournisseur> AddAsync(Fournisseur fournisseur);
        Task<Fournisseur> UpdateAsync(Fournisseur fournisseur);
        Task<bool> DeleteAsync(Guid id);
    }
}
