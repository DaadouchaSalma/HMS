
﻿using HMS.Models;


namespace HMS.Interfaces
{
    public interface IRdvRepository
    {
        Task<IEnumerable<RendezVous>> GetAllAsync();
        Task<RendezVous> GetByIdAsync(Guid id);

        //Task<IEnumerable<RendezVous>> GetDisponibilitesAsync(Guid medecinId, DateOnly date, TimeOnly time);
        //Task<List<string>> GetDisponibilitesAsync(Guid medecinId, DateOnly date);
        Task<List<TimeOnly>> GetHeuresDisponiblesAsync(Guid medecinId, DateOnly dateRDV);
        Task<IEnumerable<RendezVous>> GetRendezVousByPatientIdAsync(Guid patientId);
        Task<RendezVous> AddAsync(RendezVous rendezVous);
        Task UpdateAsync(RendezVous rendezVous);
        Task DeleteAsync(Guid id);
        Task CheckAndSendFeedbackEmailsAsync();
        Task<bool> ExistsRendezVousAsync(Guid patientId, Guid medecinId, DateOnly date);

    }
}

