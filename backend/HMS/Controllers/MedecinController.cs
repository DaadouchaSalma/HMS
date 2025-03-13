using Microsoft.AspNetCore.Mvc;
using HMS.Models;
using System.Net;

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
