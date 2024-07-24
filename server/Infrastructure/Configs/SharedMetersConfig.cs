using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class SharedMetersConfig : IEntityTypeConfiguration<SharedMeter>
{
    public void Configure(EntityTypeBuilder<SharedMeter> builder)
    {
        builder.ToTable("SharedMeters");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.MeterId).IsRequired();
        builder.Property(m => m.UserId).IsRequired();

        builder.HasIndex(m => new { m.MeterId, m.UserId }).IsUnique();
    }
}
