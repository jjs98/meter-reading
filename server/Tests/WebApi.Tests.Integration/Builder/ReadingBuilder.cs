using Domain.Models;
using Infrastructure;

namespace WebApi.Tests.Integration.Builder;

public class ReadingBuilder(AppDbContext dbContext)
{
    private readonly List<Reading> _readings = [];

    public ReadingData Result()
    {
        return new ReadingData(_readings);
    }

    public ReadingData Build()
    {
        dbContext.SaveChanges();
        return Result();
    }

    public ReadingBuilder WithReading(string number, DateTime readingDate, Meter meter)
    {
        var reading = new Reading
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

public record ReadingData(List<Reading> Readings);
