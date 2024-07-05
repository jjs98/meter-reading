using Application.Interfaces;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly ILogger<RoleController> _logger;
    private readonly IRoleService _roleService;

    public RoleController(ILogger<RoleController> logger, IRoleService roleService)
    {
        _logger = logger;
        _roleService = roleService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Role>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _roleService.GetAll();
        return Ok(roles);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Role), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var role = await _roleService.GetById(id);
            return Ok(role);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting role by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(Role), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] Role role)
    {
        var createdRole = await _roleService.Create(role);
        return CreatedAtAction(nameof(Create), new { id = createdRole.Id }, createdRole);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] Role role)
    {
        if (id != role.Id)
            return BadRequest("Role ID mismatch");

        try
        {
            await _roleService.Update(role);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while updating role by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _roleService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while deleting role by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
