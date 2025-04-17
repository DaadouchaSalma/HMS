/*using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using HMS.Models;
using HMS.Interfaces;

public class ChatBotMedRepository : IChatBotMedRepository
{
    private readonly HttpClient _httpClient;
    private readonly string _geminiApiKey = "AIzaSyDVvg556Jh_UADFPqIDKKmGri91rXAm4QI"; // Use your Gemini API key
    private readonly string _geminiModelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDVvg556Jh_UADFPqIDKKmGri91rXAm4QI"; // Gemini API endpoint (example)

    public ChatBotMedRepository(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _geminiApiKey);
    }

    public async Task<ChatResponse> GetBotResponseAsync(ChatRequest request)
    {
        var prompt = $@"Tu es un assistant IA médical, expert en santé, intégré au système hospitalier SmartCare.

        Ta mission :
        Comprendre les symptômes et signes de maladies.
        Fournir des conseils d’auto-diagnostic si un remède maison suffit.
        Recommander une consultation avec un médecin si nécessaire.
        Répondre uniquement aux questions liées à la santé. Si ce n’est pas le cas, dis : ""Je suis désolé, mais votre question dépasse mes fonctionnalités.""
        Ne cite ni URL, ni sources externes.
        Formate chaque élément de liste sur une ligne séparée précédée de ""- "".

        Réponds médicalement, avec des explications claires et en français.

        Question : {request.UserMessage}";

        // Gemini API payload (example structure)
        var payload = new
        {
            prompt = prompt,
            max_tokens = 1000 // You can adjust max tokens based on your requirements
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(_geminiModelUrl, content);
        var result = await response.Content.ReadAsStringAsync();

        Console.WriteLine("🧪 Brute model output: " + result);

        var parsed = JsonDocument.Parse(result);
        var fullText = parsed.RootElement.GetProperty("text").GetString(); // Assuming Gemini response is under "text"

        var cleanAnswer = fullText?.TrimStart();

        return new ChatResponse { Answer = cleanAnswer };
    }
}
*/

using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HMS.Interfaces;

public class ChatBotMedRepository : IChatBotMedRepository
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ChatBotMedRepository(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GeminiApiKey"]; // clé dans appsettings.json
    }

    public async Task<string> GetGeminiResponse(string userMessage)
    {
        var systemPrompt = "Tu es un assistant médical virtuel qui parle uniquement en français. " +
                       "Tu ne réponds qu'aux questions liées à la santé ou à la médecine. " +
                       "Tu ne donnes jamais de diagnostics précis ni de prescriptions de médicaments. " +
                       "Tu ne remplaces en aucun cas un professionnel de santé. " +
                       "Si la question semble sérieuse, urgente ou potentiellement dangereuse, tu recommandes immédiatement de consulter un médecin en personne."+
                       "Ne propose pas des medicaments";

        var requestBody = new
        {
            contents = new[]
            {
            new
            {
                role = "user",
                parts = new[]
                {
                    new { text = systemPrompt + "\n\nQuestion du patient : " + userMessage }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.4,      
                maxOutputTokens = 500   
            }
        };


        var requestJson = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + _apiKey);
        request.Content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        return doc.RootElement
                  .GetProperty("candidates")[0]
                  .GetProperty("content")
                  .GetProperty("parts")[0]
                  .GetProperty("text")
                  .GetString();
    }
}