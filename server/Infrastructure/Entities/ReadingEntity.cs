using Domain.Models;

namespace Infrastructure.Entities;

public class ReadingEntity
{
    public int Id { get; set; }
    public int MeterId { get; set; }
    public required string Number { get; set; }
    public required DateTime ReadingDate { get; set; }
    public MeterEntity? Meter { get; set; }

    public Reading ToDomainModel()
    {
        return new Reading
        {
            Id = Id,
            MeterId = MeterId,
            Number = Number,
            ReadingDate = ReadingDate,
        };
    }

    public static ReadingEntity FromDomainModel(Reading reading)
    {
        return new ReadingEntity
        {
            Id = reading.Id,
            MeterId = reading.MeterId,
            Number = reading.Number,
            ReadingDate = reading.ReadingDate,
        };
    }
}
