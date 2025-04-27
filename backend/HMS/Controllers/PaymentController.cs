using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace HMS.Controllers
{
    public class PaymentController : Controller
    {
        private readonly StripeClient _stripeClient;

        public PaymentController(StripeClient stripeClient)
        {
            _stripeClient = stripeClient;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = 5000,  // Montant en centimes (ici 50.00€)
                        Currency = "eur",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Consultation médicale"
                        },
                    },
                    Quantity = 1,
                },
            },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/#/pay/new",
                CancelUrl = "http://localhost:4200/cancel",
            };

            var service = new SessionService(_stripeClient);
            Session session = await service.CreateAsync(options);

            return Json(new { id = session.Id });
        }
    }
}
