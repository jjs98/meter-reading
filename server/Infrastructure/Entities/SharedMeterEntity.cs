using Domain.Models;

namespace Infrastructure.Entities;

public class SharedMeterEntity
{
    public int MeterId { get; set; }
    public int UserId { get; set; }

    public MeterEntity? Meter { get; set; }
    public UserEntity? User { get; set; }

    public SharedMeter ToDomainModel()
    {
        return new SharedMeter { MeterId = MeterId, UserId = UserId };
    }

    public static SharedMeterEntity FromDomainModel(SharedMeter sharedMeter)
    {
        return new SharedMeterEntity { MeterId = sharedMeter.MeterId, UserId = sharedMeter.UserId };
    }
}
