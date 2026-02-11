using Domain.Enums;
using Domain.Models;

namespace Infrastructure.Entities;

public class MeterEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Location { get; set; }
    public string? MeterNumber { get; set; }
    public string? Addition { get; set; }
    public MeterType Type { get; set; }
    public IEnumerable<ReadingEntity>? Readings { get; set; }
    public IEnumerable<SharedMeterEntity>? SharedMeters { get; set; }
    public UserEntity? User { get; set; }

    public Meter ToDomainModel()
    {
        return new Meter
        {
            Id = Id,
            UserId = UserId,
            Location = Location,
            MeterNumber = MeterNumber,
            Addition = Addition,
            Type = Type,
        };
    }

    public static MeterEntity FromDomainModel(Meter meter)
    {
        return new MeterEntity
        {
            Id = meter.Id,
            UserId = meter.UserId,
            Location = meter.Location,
            MeterNumber = meter.MeterNumber,
            Addition = meter.Addition,
            Type = meter.Type,
        };
    }
}
