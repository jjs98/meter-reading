using Domain.Enums;

namespace Domain.Models;

public class Meter : DbEntity
{
    public required int UserId { get; set; }
    public required string Location { get; set; }
    public required string MeterNumber { get; set; }
    public string? Comment { get; set; }
    public MeterType Type { get; set; }
    public IEnumerable<Reading>? Readings { get; set; }
}
