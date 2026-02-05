using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class SharedMetersConfig : IEntityTypeConfiguration<SharedMeter>
{
    public void Configure(EntityTypeBuilder<SharedMeter> builder)
    {
        builder.ToTable("SharedMeters");

        builder.HasKey(sharedMeter => sharedMeter.Id);
        builder.Property(sharedMeter => sharedMeter.Id).UseIdentityColumn();
        builder.Property(sharedMeter => sharedMeter.CreateDate);
        builder.Property(sharedMeter => sharedMeter.UpdateDate);

        builder.Property(sharedMeter => sharedMeter.MeterId).IsRequired();
        builder.Property(sharedMeter => sharedMeter.UserId).IsRequired();

        builder.HasIndex(sharedMeter => new { sharedMeter.MeterId, sharedMeter.UserId }).IsUnique();

        builder.HasOne(sharedMeter => sharedMeter.Meter).WithMany(meter => meter.SharedMeters).HasForeignKey(sharedMeter => sharedMeter.MeterId);
        builder.HasOne(sharedMeter => sharedMeter.User).WithMany(user => user.SharedMeters).HasForeignKey(sharedMeter => sharedMeter.UserId);
    }
}
