using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class PharmacieController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
