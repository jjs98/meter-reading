using Domain.Models;
using Infrastructure;

namespace Presentation.Tests.Integration.Builder;

public class MeterBuilder(AppDbContext dbContext)
{
    private readonly List<Meter> _meters = [];

    public MeterData Result()
    {
        return new MeterData(_meters);
    }

    public MeterData Build()
    {
        dbContext.SaveChanges();
        return Result();
    }

    public MeterBuilder WithMeter(string location, User user)
    {
        var meter = new Meter { Location = location, User = user };
        dbContext.Meters.Add(meter);
        _meters.Add(meter);

        return this;
    }
}

public record MeterData(List<Meter> Meters);
