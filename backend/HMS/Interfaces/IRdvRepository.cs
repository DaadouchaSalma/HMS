
using HMS.Models;

namespace HMS.Interfaces
{
    public interface IRdvRepository
    {
        Task CheckAndSendFeedbackEmailsAsync();
        Task<RendezVous> AddAsync(RendezVous rendezVous);
        Task<List<TimeOnly>> GetHeuresDisponiblesAsync(Guid medecinId, DateOnly dateRDV);
    }
}

