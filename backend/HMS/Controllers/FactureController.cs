using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class FactureController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
