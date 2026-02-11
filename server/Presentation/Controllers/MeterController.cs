using System.Security.Claims;
using Application.DTOs;
using Application.Services;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Presentation.Controllers;

[Authorize(Roles = "User")]
[ApiController]
[Route("api/[controller]")]
public class MeterController : ControllerBase
{
    private readonly ILogger<MeterController> _logger;
    private readonly IMeterService _meterService;
    private readonly IUserService _userService;

    public MeterController(
        ILogger<MeterController> logger,
        IMeterService meterService,
        IUserService userService
    )
    {
        _logger = logger;
        _meterService = meterService;
        _userService = userService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Meter>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
        if (userId == -1)
            return Unauthorized();

        var meters = await _meterService.GetByUserId(userId);
        return Ok(meters);
    }

    [HttpGet("shared")]
    [ProducesResponseType(typeof(IEnumerable<Meter>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetShared()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized();

            var meters = await _meterService.GetShared(userId);
            return Ok(meters);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting meter share");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("shared/{meterId}")]
    [ProducesResponseType(typeof(IEnumerable<MeterShareDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSharedByMeterId(int meterId)
    {
        try
        {
            var meter = await _meterService.GetById(meterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
            {
                return Unauthorized();
            }

            var meterShareDtoList = new List<MeterShareDto>();
            var sharedMeters = await _meterService.GetSharedByMeterId(meterId);

            foreach (var sharedMeter in sharedMeters)
            {
                var user = await _userService.GetById(sharedMeter.UserId);
                meterShareDtoList.Add(
                    new MeterShareDto
                    {
                        MeterId = sharedMeter.MeterId,
                        UserId = sharedMeter.UserId,
                        Username = user.Username,
                    }
                );
            }

            return Ok(meterShareDtoList);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting meter share");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost("share")]
    [ProducesResponseType(typeof(SharedMeter), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ShareMeter([FromBody] MeterShareDto meterShareDto)
    {
        try
        {
            var meter = await _meterService.GetById(meterShareDto.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
                return Unauthorized();

            var user = await _userService.GetByUsername(meterShareDto.Username);
            if (user == null)
                return NotFound();

            var createdSharedMeter = await _meterService.ShareMeter(user.Id, meterShareDto.MeterId);
            return CreatedAtAction(
                nameof(ShareMeter),
                new { id = createdSharedMeter.Id },
                createdSharedMeter
            );
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(
                ex,
                "An error occurred while sharing meter with id {Id} for user {User}",
                meterShareDto.MeterId,
                meterShareDto.Username
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("revoke")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RevokeMeter([FromBody] RevokeMeterShareDto sharedMeter)
    {
        try
        {
            var meter = await _meterService.GetById(sharedMeter.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
                && sharedMeter.UserId
                    != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            )
            {
                var sharedMeterToDelete = await _meterService.GetSharedByMeterId(
                    sharedMeter.MeterId
                );
                if (!sharedMeterToDelete.Any(x => x.UserId == sharedMeter.UserId))
                {
                    return Unauthorized();
                }
            }

            await _meterService.RevokeMeter(sharedMeter.UserId, sharedMeter.MeterId);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(
                ex,
                "An error occurred while revoking meter with id {Id} for user {User}",
                sharedMeter.MeterId,
                sharedMeter.UserId
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(Meter), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] Meter meter)
    {
        if (
            meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
            return Unauthorized();

        var createdMeter = await _meterService.Create(meter);
        return CreatedAtAction(nameof(Create), new { id = createdMeter.Id }, createdMeter);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] Meter meter)
    {
        if (id != meter.Id)
            return BadRequest("Meter ID mismatch");

        if (
            meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
            return Unauthorized();

        try
        {
            await _meterService.Update(meter);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();
            var meterId = Sanitize(meter.Id);
            _logger.LogError(
                ex,
                "An error occurred while updating meter by id for id {MeterId}",
                meterId
            );
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        static string Sanitize(int id)
        {
            return id.ToString();
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
            var meter = await _meterService.GetById(id);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
                return Unauthorized();

            await _meterService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, "An error occurred while deleting meter by id for id {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
