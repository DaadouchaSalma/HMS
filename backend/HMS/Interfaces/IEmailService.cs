namespace HMS.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string nom);
    }
}
