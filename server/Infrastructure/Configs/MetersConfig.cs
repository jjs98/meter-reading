using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class MetersConfig : IEntityTypeConfiguration<Meter>
{
    public void Configure(EntityTypeBuilder<Meter> builder)
    {
        builder.ToTable("Meters");

        builder.HasKey(meter => meter.Id);
        builder.Property(meter => meter.Id).UseIdentityColumn();
        builder.Property(meter => meter.CreateDate);
        builder.Property(meter => meter.UpdateDate);

        builder.Property(meter => meter.UserId).IsRequired();
        builder.Property(meter => meter.Location).IsRequired();
        builder.Property(meter => meter.Type).IsRequired();
        builder.Property(meter => meter.MeterNumber);
        builder.Property(meter => meter.Addition);

        builder
            .HasOne(meter => meter.User)
            .WithMany(user => user.Meters)
            .HasForeignKey(meter => meter.UserId);
    }
}
