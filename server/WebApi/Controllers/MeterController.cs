using Application.DTOs;
using Application.Interfaces;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class MeterController : ControllerBase
{
    private readonly ILogger<MeterController> _logger;
    private readonly IMeterService _meterService;

    public MeterController(ILogger<MeterController> logger, IMeterService meterService)
    {
        _logger = logger;
        _meterService = meterService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(MeterDto[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var meters = await _meterService.GetAll();
        return Ok(meters);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(MeterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var meter = await _meterService.GetById(id);
            return Ok(meter);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while getting meter by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(MeterDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] MeterDto meter)
    {
        var createdMeter = await _meterService.Create(meter);
        return CreatedAtAction(nameof(Create), new { id = createdMeter.Id }, createdMeter);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(int id, [FromBody] MeterDto meter)
    {
        if (id != meter.Id)
            return BadRequest("Meter ID mismatch");

        try
        {
            await _meterService.Update(meter);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while updating meter by id for id {meter.Id}");
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
            await _meterService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
                return NotFound();

            _logger.LogError(ex, $"An error occurred while deleting meter by id for id {id}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
