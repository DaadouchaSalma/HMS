using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class MedMatController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
