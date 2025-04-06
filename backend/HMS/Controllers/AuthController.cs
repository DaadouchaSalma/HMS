using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;

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

            // Sign in the user
            var signInManager = HttpContext.RequestServices.GetRequiredService<SignInManager<ApplicationUser>>();
            await signInManager.SignInAsync(user, isPersistent: true);  // Keeps user logged in

            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            /*Response.Cookies.Append("AuthCookie", "true", new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Use `false` only in local development
                SameSite = SameSiteMode.None
            });*/

            return Ok(new
            {
                message = "Connexion réussie",
                roles
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme); 
            return Ok(new { message = "Logout successful" });
        }

    }
}
