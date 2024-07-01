using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class MeterConfig : IEntityTypeConfiguration<Meter>
{
    public void Configure(EntityTypeBuilder<Meter> builder)
    {
        builder.ToTable("Meters");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).ValueGeneratedOnAdd();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.Owner).IsRequired();
        builder.Property(m => m.Location).IsRequired();
        builder.Property(m => m.Type).IsRequired();
        builder.Property(m => m.MeterNumber).IsRequired();
        builder.Property(m => m.Comment);
    }
}
