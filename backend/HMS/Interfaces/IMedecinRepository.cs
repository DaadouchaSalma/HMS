using HMS.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HMS.Interfaces
{
    public interface IMedecinRepository
    {
        Medecin GetById(Guid id);
        void Update(Medecin medecin);
        void Save();

        Task<IEnumerable<Medecin>> GetAll();
        Task Add(Medecin medecin);
        Task SaveAsync();

        Task<Medecin?> GetByIdAsync(Guid id);

        void Delete(Medecin medecin);

    }
}
