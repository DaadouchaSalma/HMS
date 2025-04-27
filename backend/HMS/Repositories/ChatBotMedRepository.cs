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
    private readonly ApplicationDbContext _dbContext;

    public ChatBotMedRepository(HttpClient httpClient, IConfiguration configuration, ApplicationDbContext dbContext)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GeminiApiKey"]; // clé dans appsettings.json
        _dbContext = dbContext;

    }

    public async Task<string> GetGeminiResponse(string userMessage)
    {
        // Fetch all doctors with their services
        var doctors = _dbContext.Medecins
            .Select(m => new
            {
                m.Id,
                m.Nom,  // Assuming these properties exist in Personnel base class
                m.Prenom,
                m.Grad_med,
                m.service
            })
            .ToList();
        var doctorsListString = string.Join(", ", doctors.Select(doc => $"'{doc.Nom} {doc.Prenom}':'{doc.service}'"));
        var systemPrompt = "Tu es un assistant médical virtuel qui parle uniquement en français. " +
                        
                       "Tu ne réponds qu'aux questions liées à la santé ou à la médecine. " +
                       "Tu ne donnes jamais de diagnostics précis ni de prescriptions de médicaments. " +
                       "Tu ne remplaces en aucun cas un professionnel de santé. " +
                       $"Si la question semble sérieuse, urgente ou potentiellement dangereuse, tu recommandes immédiatement de consulter un médecin en personne.voici une liste des medecin à recommander en cas de besoin {doctorsListString}" +
                       "Si aucun médecin correspondant à la spécialité nécessaire n'est disponible dans cette liste, " +
                       "propose simplement une spécialité médicale adaptée sans citer de nom." +
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
  /*  public async Task<string> GetGeminiResponse(string userMessage)
    {
        var doctors = _dbContext.Medecins
            .Select(m => new
            {
                m.Id,
                m.Nom,
                m.Prenom,
                m.Grad_med,
                m.service
            })
            .ToList();

        // Première étape : vérifier si c'est des symptômes
        var detectionPrompt = "Tu es un assistant médical en français. " +
                              "Indique seulement par OUI ou NON si le texte suivant décrit des symptômes physiques ou médicaux. " +
                              "Ne donne aucune explication, juste OUI ou NON.";

        var detectionRequestBody = new
        {
            contents = new[]
            {
            new
            {
                role = "user",
                parts = new[]
                {
                    new { text = detectionPrompt + "\n\nTexte : " + userMessage }
                }
            }
        },
            generationConfig = new
            {
                temperature = 0.0,
                maxOutputTokens = 10
            }
        };

        var detectionJson = JsonSerializer.Serialize(detectionRequestBody);
        var detectionRequest = new HttpRequestMessage(HttpMethod.Post, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + _apiKey);
        detectionRequest.Content = new StringContent(detectionJson, Encoding.UTF8, "application/json");

        var detectionResponse = await _httpClient.SendAsync(detectionRequest);
        detectionResponse.EnsureSuccessStatusCode();

        var detectionResultJson = await detectionResponse.Content.ReadAsStringAsync();
        var detectionDoc = JsonDocument.Parse(detectionResultJson);
        var isSymptomText = detectionDoc.RootElement
                                        .GetProperty("candidates")[0]
                                        .GetProperty("content")
                                        .GetProperty("parts")[0]
                                        .GetProperty("text")
                                        .GetString()
                                        ?.Trim()
                                        ?.ToLower();

        // Si c'est des symptômes => chercher un médecin
        if (isSymptomText == "oui")
        {
            // Deuxième étape : demander la spécialité
            var specialityPrompt = "Tu es un assistant médical en français. " +
                                    "À partir des symptômes donnés, indique UNIQUEMENT la spécialité médicale concernée en un seul mot. " +
                                    "Exemples : cardiologie, dermatologie, pneumologie, etc. " +
                                    "Si tu n'es pas sûr, propose 'médecine générale'.";

            var specialityRequestBody = new
            {
                contents = new[]
                {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = specialityPrompt + "\n\nSymptômes du patient : " + userMessage }
                    }
                }
            },
                generationConfig = new
                {
                    temperature = 0.2,
                    maxOutputTokens = 50
                }
            };

            var specialityJson = JsonSerializer.Serialize(specialityRequestBody);
            var specialityRequest = new HttpRequestMessage(HttpMethod.Post, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + _apiKey);
            specialityRequest.Content = new StringContent(specialityJson, Encoding.UTF8, "application/json");

            var specialityResponse = await _httpClient.SendAsync(specialityRequest);
            specialityResponse.EnsureSuccessStatusCode();

            var specialityResultJson = await specialityResponse.Content.ReadAsStringAsync();
            var specialityDoc = JsonDocument.Parse(specialityResultJson);
            var speciality = specialityDoc.RootElement
                                          .GetProperty("candidates")[0]
                                          .GetProperty("content")
                                          .GetProperty("parts")[0]
                                          .GetProperty("text")
                                          .GetString()
                                          ?.Trim()
                                          ?.ToLower();

            if (string.IsNullOrEmpty(speciality))
            {
                return "Je n'ai pas pu identifier une spécialité. Je vous conseille de consulter un médecin généraliste.";
            }

            // Chercher un médecin dans la base
            var doctor = doctors.FirstOrDefault(d => d.service.ToLower().Contains(speciality));

            if (doctor != null)
            {
                return $"Je vous recommande de consulter : Dr {doctor.Prenom} {doctor.Nom}, spécialiste en {doctor.service}.";
            }
            else
            {
                return "Je n'ai trouvé aucun spécialiste correspondant. Veuillez consulter un médecin généraliste.";
            }
        }
        else
        {
            // Sinon, réponse normale à la question de l'utilisateur
            var systemPrompt = "Tu es un assistant médical virtuel en français. " +
                               "Tu réponds aux questions de santé de manière informative et simple, " +
                               "sans donner de diagnostic médical ni de prescription de médicaments. " +
                               "Si la question semble urgente, recommande d'aller consulter un médecin.";

            var normalRequestBody = new
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

            var normalJson = JsonSerializer.Serialize(normalRequestBody);
            var normalRequest = new HttpRequestMessage(HttpMethod.Post, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + _apiKey);
            normalRequest.Content = new StringContent(normalJson, Encoding.UTF8, "application/json");

            var normalResponse = await _httpClient.SendAsync(normalRequest);
            normalResponse.EnsureSuccessStatusCode();

            var normalResultJson = await normalResponse.Content.ReadAsStringAsync();
            var normalDoc = JsonDocument.Parse(normalResultJson);

            return normalDoc.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();
        }
    }*/


}