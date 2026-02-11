using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class SharedMetersConfig : IEntityTypeConfiguration<SharedMeterEntity>
{
    public void Configure(EntityTypeBuilder<SharedMeterEntity> builder)
    {
        builder.ToTable("SharedMeters");

        builder.HasKey(sharedMeter => new { sharedMeter.MeterId, sharedMeter.UserId });

        builder.Property(sharedMeter => sharedMeter.MeterId).IsRequired();
        builder.Property(sharedMeter => sharedMeter.UserId).IsRequired();

        builder.HasIndex(sharedMeter => new { sharedMeter.MeterId, sharedMeter.UserId }).IsUnique();

        builder
            .HasOne(sharedMeter => sharedMeter.Meter)
            .WithMany(meter => meter.SharedMeters)
            .HasForeignKey(sharedMeter => sharedMeter.MeterId);
        builder
            .HasOne(sharedMeter => sharedMeter.User)
            .WithMany(user => user.SharedMeters)
            .HasForeignKey(sharedMeter => sharedMeter.UserId);
    }
}
