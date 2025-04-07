using HMS.Models;

namespace HMS.Interfaces
{
    public interface IDossierMRepository
    {
        Task<DossierM> CreateDossierM(DossierM dossier);
        Task<DossierM> UpdateDossierM(Guid id, DossierM dossierUpdates);
    }
}
