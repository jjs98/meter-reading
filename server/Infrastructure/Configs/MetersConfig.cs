using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class MetersConfig : IEntityTypeConfiguration<Meter>
{
    public void Configure(EntityTypeBuilder<Meter> builder)
    {
        builder.ToTable("Meters");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.UserId).IsRequired();
        builder.Property(m => m.Location).IsRequired();
        builder.Property(m => m.Type).IsRequired();
        builder.Property(m => m.MeterNumber);
        builder.Property(m => m.Addition);
    }
}
