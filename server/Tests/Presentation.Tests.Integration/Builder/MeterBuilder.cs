using Infrastructure;
using Infrastructure.Entities;

namespace Presentation.Tests.Integration.Builder;

public class MeterBuilder(AppDbContext dbContext)
{
    private readonly List<MeterEntity> _meters = [];

    public MeterData Result()
    {
        return new MeterData(_meters);
    }

    public MeterData Build()
    {
        dbContext.SaveChanges();
        return Result();
    }

    public MeterBuilder WithMeter(string location, UserEntity user)
    {
        var meter = new MeterEntity { Location = location, User = user };
        dbContext.Meters.Add(meter);
        _meters.Add(meter);

        return this;
    }
}

public record MeterData(List<MeterEntity> Meters);
