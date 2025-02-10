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

    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<User>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAll();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(User), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
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
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(User), (int)HttpStatusCode.Created)]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        var createdUser = await _userService.Create(user);
        return CreatedAtAction(nameof(Create), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("{id}")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
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
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }

        static string Sanitize(int id)
        {
            return id.ToString();
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
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
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }
    }
}
