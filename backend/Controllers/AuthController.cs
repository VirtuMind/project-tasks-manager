using Microsoft.AspNetCore.Mvc;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Services;

namespace ProjectTasksManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService _authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result is null)
           return Unauthorized("Invalid email or password");

        return Ok(result);
    }
}
