using System.Security.Claims;
using Application.Interfaces;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize(Roles = "User")]
[ApiController]
[Route("api/[controller]")]
public class ReadingController : ControllerBase
{
    private readonly ILogger<ReadingController> _logger;
    private readonly IReadingService _readingService;
    private readonly IMeterService _meterService;

    public ReadingController(
        ILogger<ReadingController> logger,
        IReadingService readingService,
        IMeterService meterService
    )
    {
        _logger = logger;
        _readingService = readingService;
        _meterService = meterService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Reading>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetBy(int meterId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized();

            var readings = await _readingService.GetBy(userId, meterId);
            return Ok(readings);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting reading for meter id {meterId}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Reading), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var reading = await _readingService.GetById(id);
            var meter = await _meterService.GetById(reading.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
                return Unauthorized();

            return Ok(reading);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting reading by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(Reading), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] Reading reading)
    {
        var meter = await _meterService.GetById(reading.MeterId);

        if (
            meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
            return Unauthorized();

        var createdReading = await _readingService.Create(reading);
        return CreatedAtAction(nameof(Create), new { id = createdReading.Id }, createdReading);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] Reading reading)
    {
        try
        {
            var meter = await _meterService.GetById(reading.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
                return Unauthorized();

            await _readingService.Update(reading);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while updating reading by id for id {id}");
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
            var reading = await _readingService.GetById(id);
            var meter = await _meterService.GetById(reading.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
                return Unauthorized();

            await _readingService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while deleting reading by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
