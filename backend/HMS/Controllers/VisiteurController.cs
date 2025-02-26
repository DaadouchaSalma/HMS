using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class VisiteurController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
