using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class ReadingsConfig : IEntityTypeConfiguration<Reading>
{
    public void Configure(EntityTypeBuilder<Reading> builder)
    {
        builder.ToTable("Readings");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.MeterId).IsRequired();
        builder.Property(m => m.Number).IsRequired();
        builder.Property(m => m.ReadingDate).IsRequired();

        builder.HasIndex(m => m.ReadingDate).IsUnique();
    }
}
