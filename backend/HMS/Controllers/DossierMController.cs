using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class DossierMController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
