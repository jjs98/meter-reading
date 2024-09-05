using System.Security.Claims;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        IUserService userService,
        ILogger<AuthController> logger
    )
    {
        _authService = authService;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        try
        {
            var token = await _authService.Login(userLoginDto);
            return Ok(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while logging in");
            return Unauthorized();
        }
    }

    [Authorize]
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(TokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized();

            var user = await _userService.GetById(userId);
            var token = await _authService.Refresh(user);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("changePassword")]
    [ProducesResponseType(typeof(TokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized();

            await _userService.ChangePassword(userId, changePasswordDto);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while changing the password");
            return Unauthorized();
        }
    }

    [HttpPost("hash")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public IActionResult HashPassword([FromBody] string password)
    {
        return Ok(_authService.HashPassword(password));
    }
}
