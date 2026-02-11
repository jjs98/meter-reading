using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class ReadingsConfig : IEntityTypeConfiguration<ReadingEntity>
{
    public void Configure(EntityTypeBuilder<ReadingEntity> builder)
    {
        builder.ToTable("Readings");

        builder.HasKey(reading => reading.Id);
        builder.Property(reading => reading.Id).UseIdentityColumn();

        builder.Property(reading => reading.MeterId).IsRequired();
        builder.Property(reading => reading.Number).IsRequired();
        builder.Property(reading => reading.ReadingDate).IsRequired();

        builder.HasIndex(reading => new { reading.MeterId, reading.ReadingDate }).IsUnique();

        builder
            .HasOne(reading => reading.Meter)
            .WithMany(meter => meter.Readings)
            .HasForeignKey(reading => reading.MeterId);
    }
}
