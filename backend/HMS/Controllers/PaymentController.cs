using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace HMS.Controllers
{
    public class PaymentController : Controller
    {
        private readonly StripeClient _stripeClient;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentController(StripeClient stripeClient, ApplicationDbContext context, IConfiguration configuration)
        {
            _stripeClient = stripeClient;
            _context = context;
            _configuration = configuration;
        }


        [HttpPost("create-checkout-session/{montant}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CreateCheckoutSession(float montant, Guid factureId)
        {
            long montantLong = (long)(montant * 100);
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = montantLong,
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Facture d'hospitalisation"
                        },
                    },
                    Quantity = 1,
                },
            },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/#/facture/historique?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "http://localhost:4200/cancel",
                Metadata = new Dictionary<string, string>
                {
                    { "factureId", factureId.ToString() }
                }
            };

            var service = new SessionService(_stripeClient);
            Session session = await service.CreateAsync(options);

            return Json(new { id = session.Id });
        }

        [HttpGet("session-status/{sessionId}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CheckSessionStatus(string sessionId)
        {
            var service = new SessionService(_stripeClient);
            var session = await service.GetAsync(sessionId);

            if (session.PaymentStatus == "paid")
            {
                var factureId = session.Metadata["factureId"];

                var facture = await _context.Factures.FindAsync(Guid.Parse(factureId));
                if (facture != null)
                {
                    facture.status = "Payée";
                    await _context.SaveChangesAsync();
                }
                return Ok(new { paid = true });
            }

            return Ok(new { paid = false });
        }

    }
}
