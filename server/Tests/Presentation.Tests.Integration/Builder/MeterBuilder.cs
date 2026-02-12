using Domain.Enums;
using Infrastructure;
using Infrastructure.Entities;

namespace Presentation.Tests.Integration.Builder;

public class MeterBuilder(AppDbContext dbContext)
{
    private readonly List<MeterEntity> _meters = [];
    private readonly List<SharedMeterEntity> _sharedMeters = [];

    public MeterData Result()
    {
        return new MeterData(_meters, _sharedMeters);
    }

    public MeterData Build()
    {
        dbContext.SaveChanges();
        return Result();
    }

    public MeterBuilder WithMeter(string location, UserEntity user)
    {
        return WithMeter(location, user, MeterType.Gas);
    }

    public MeterBuilder WithMeter(
        string location,
        UserEntity user,
        MeterType type,
        string? meterNumber = null,
        string? addition = null
    )
    {
        var meter = new MeterEntity
        {
            Location = location,
            User = user,
            Type = type,
            MeterNumber = meterNumber,
            Addition = addition,
        };
        dbContext.Meters.Add(meter);
        _meters.Add(meter);

        return this;
    }

    public MeterBuilder WithSharedMeter(MeterEntity meter, UserEntity user)
    {
        var sharedMeter = new SharedMeterEntity { Meter = meter, User = user };
        dbContext.SharedMeters.Add(sharedMeter);
        _sharedMeters.Add(sharedMeter);

        return this;
    }
}

public record MeterData(List<MeterEntity> Meters, List<SharedMeterEntity> SharedMeters);
