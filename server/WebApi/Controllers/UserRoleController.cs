using Application.Services;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UserRoleController : ControllerBase
{
    private readonly ILogger<UserRoleController> _logger;
    private readonly IUserRoleService _userRoleService;

    public UserRoleController(ILogger<UserRoleController> logger, IUserRoleService userRoleService)
    {
        _logger = logger;
        _userRoleService = userRoleService;
    }

    [HttpGet("role/{roleId}")]
    [ProducesResponseType(typeof(IEnumerable<UserRole>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByRoleId(int roleId)
    {
        try
        {
            var userRoles = await _userRoleService.GetByRoleId(roleId);
            return Ok(userRoles);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                $"An error occurred while getting user role by role id for id {roleId}"
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(IEnumerable<UserRole>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        try
        {
            var userRoles = await _userRoleService.GetByUserId(userId);
            return Ok(userRoles);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                $"An error occurred while getting user role by user id for id {userId}"
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(UserRole), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] UserRole userRole)
    {
        var createdUserRole = await _userRoleService.Create(userRole);
        return CreatedAtAction(nameof(Create), new { id = createdUserRole.Id }, createdUserRole);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] UserRole userRole)
    {
        if (id != userRole.Id)
            return BadRequest("UserRole ID mismatch");

        try
        {
            if (id != userRole.Id)
                return BadRequest();

            await _userRoleService.Update(userRole);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while updating user role for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _userRoleService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while deleting user role for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
