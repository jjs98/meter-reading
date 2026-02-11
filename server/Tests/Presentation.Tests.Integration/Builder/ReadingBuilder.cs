using Infrastructure;
using Infrastructure.Entities;

namespace Presentation.Tests.Integration.Builder;

public class ReadingBuilder(AppDbContext dbContext)
{
    private readonly List<ReadingEntity> _readings = [];

    public ReadingData Result()
    {
        return new ReadingData(_readings);
    }

    public ReadingData Build()
    {
        dbContext.SaveChanges();
        return Result();
    }

    public ReadingBuilder WithReading(string number, DateTime readingDate, MeterEntity meter)
    {
        var reading = new ReadingEntity
        {
            Number = number,
            ReadingDate = readingDate,
            Meter = meter,
        };
        dbContext.Readings.Add(reading);
        _readings.Add(reading);

        return this;
    }
}

public record ReadingData(List<ReadingEntity> Readings);
