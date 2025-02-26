using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class ChambreController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
