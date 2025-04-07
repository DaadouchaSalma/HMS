using HMS.Models;

namespace HMS.Interfaces
{
    public interface IMedMatRepository
    {
        Medicament? GetByName(string name);

    }
}
