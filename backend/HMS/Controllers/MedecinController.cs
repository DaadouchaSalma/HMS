using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class MedecinController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
