using Domain.Enums;

namespace Domain.Models;

public class Meter : DbEntity
{
    public required int UserId { get; set; }
    public required string Location { get; set; }
    public string? MeterNumber { get; set; }
    public string? Addition { get; set; }
    public MeterType Type { get; set; }
    public IEnumerable<Reading>? Readings { get; set; }
    public IEnumerable<SharedMeter>? SharedMeters { get; set; }
}
