using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;  

        public AuthController(UserManager<ApplicationUser> userManager,
                              RoleManager<IdentityRole> roleManager,
                              ApplicationDbContext context) 
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;  
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized(new { message = "Identifiants incorrects" });

            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                message = "Connexion réussie",
                roles // Returns the list of roles assigned to the user
            });
        }
    }
}
