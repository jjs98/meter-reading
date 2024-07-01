using Domain.Enums;

namespace Application.DTOs;

public class MeterDto
{
    public int Id { get; set; }
    public required string Owner { get; set; }
    public required string Location { get; set; }
    public required string MeterNumber { get; set; }
    public string? Comment { get; set; }
    public MeterType Type { get; set; }
}
