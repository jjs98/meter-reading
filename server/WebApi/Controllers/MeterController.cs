using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class MeterController : ControllerBase
{
    private static IEnumerable<Meter> meters = [];
    private static int counter = 1;

    private readonly ILogger<MeterController> _logger;

    public MeterController(ILogger<MeterController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(meters);
    }

    [HttpGet("{id}")]
    public IActionResult GetAll(int id)
    {
        var meter = meters.FirstOrDefault(m => m.Id == id);
        if (meter == null)
        {
            return NotFound();
        }
        return Ok(meter);
    }

    [HttpPost]
    public IActionResult Create(Meter meter)
    {
        meter.Id = counter;
        counter++;
        meters = meters.Append(meter);
        return CreatedAtAction(nameof(GetAll), meter);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Meter meter)
    {
        var existingMeter = meters.FirstOrDefault(m => m.Id == id);
        if (existingMeter == null)
        {
            return NotFound();
        }
        meter.ChangeDate = DateTime.UtcNow;
        meters = meters.Select(m => m.Id == id ? meter : m);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingMeter = meters.FirstOrDefault(m => m.Id == id);
        if (existingMeter == null)
        {
            return NotFound();
        }
        meters = meters.Where(m => m.Id != id);
        return NoContent();
    }
}
