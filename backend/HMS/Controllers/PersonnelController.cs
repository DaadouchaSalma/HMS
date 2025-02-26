using Microsoft.AspNetCore.Mvc;

namespace HMS.Controllers
{
    public class PersonnelController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
