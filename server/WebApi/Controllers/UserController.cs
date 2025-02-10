using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "User")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;
    private readonly IMeterService _meterService;

    public UserController(ILogger<UserController> logger, IUserService userService, IMeterService meterService)
    {
        _logger = logger;
        _userService = userService;
        _meterService = meterService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<User>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAll();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(int id)
    {
        if (
            id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
            return Unauthorized();
        try
        {
            var user = await _userService.GetById(id);
            return Ok(user);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, "An error occurred while getting user by id for id {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(User), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        var createdUser = await _userService.Create(user);
        return CreatedAtAction(nameof(Create), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] User user)
    {
        if (
            (
                id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                || user.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            ) && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
            return Unauthorized();

        if (id != user.Id)
            return BadRequest("User ID mismatch");

        try
        {
            await _userService.Update(user);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            var userId = Sanitize(user.Id);
            _logger.LogError(
                ex,
                "An error occurred while updating user by id for id {UserId}",
                userId
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        static string Sanitize(int id)
        {
            return id.ToString();
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _userService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, "An error occurred while deleting user by id for id {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
