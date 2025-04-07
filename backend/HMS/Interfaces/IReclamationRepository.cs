using HMS.Models;

namespace HMS.Interfaces
{
    public interface IReclamationRepository
    {
        Task<IEnumerable<Reclamation>> GetAll();
        Task<Reclamation> GetById(Guid id);
        Task<IEnumerable<Reclamation>> GetByChambreId(Guid chambreId);
        Task<Reclamation> Add(Reclamation reclamation);
        Task<bool> Delete(Guid id);
    }
}
