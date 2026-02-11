using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Presentation.Controllers;

[Authorize(Roles = "User")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;
    private readonly IMeterService _meterService;

    public UserController(
        ILogger<UserController> logger,
        IUserService userService,
        IMeterService meterService
    )
    {
        _logger = logger;
        _userService = userService;
        _meterService = meterService;
    }

    [HttpGet("{id}/name")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetName(int id)
    {
        var requestingUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");

        try
        {
            var meters = await _meterService.GetShared(requestingUserId);

            if (!meters.Any(x => x.UserId == id))
            {
                return Unauthorized();
            }

            var user = await _userService.GetById(id);
            return Ok(user.GetName());
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, "An error occurred while getting user by id for id {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
