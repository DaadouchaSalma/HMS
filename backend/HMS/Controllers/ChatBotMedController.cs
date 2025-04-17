/*using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotMedController : Controller
    {
        private readonly IChatBotMedRepository _chatService;

        public ChatBotMedController(IChatBotMedRepository chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequest request)
        {
            Console.WriteLine("🔍 Reçu du client : " + request?.UserMessage ?? "null");
            var response = await _chatService.GetBotResponseAsync(request);
            return Ok(response);
        }
    }
}*/
using HMS.Interfaces;
using HMS.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChatBotMedController : ControllerBase
{
    private readonly IChatBotMedRepository _geminiService;

    public ChatBotMedController(IChatBotMedRepository geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskGemini([FromBody] ChatRequest request)
    {
        // Assure-toi que le 'request' contient bien un 'prompt' avant de l'envoyer au service
        if (string.IsNullOrEmpty(request?.UserMessage))
        {
            return BadRequest("Le prompt ne peut pas être vide.");
        }

        // Appel à GeminiService pour obtenir une réponse
        var response = await _geminiService.GetGeminiResponse(request.UserMessage);

        // Retourner la réponse sous forme de JSON
        return Ok(response);
    }
}