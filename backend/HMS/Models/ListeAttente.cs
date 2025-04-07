using HMS.Models;

public class ListeAttente
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid MedecinId { get; set; }
    public DateOnly Date_RDV { get; set; }
    public DateTime DateAjout { get; set; }
    public Patient Patient { get; set; }
    public Medecin Medecin { get; set; }
}