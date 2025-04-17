using HMS.Models;

namespace HMS.Interfaces
{
    public interface IChatBotMedRepository
    {
        Task<string> GetGeminiResponse(string userMessage);
    }
}
