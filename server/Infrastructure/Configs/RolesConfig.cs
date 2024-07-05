using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class RolesConfig : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(m => new { m.Id, m.Name, });
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.Name).IsRequired();
    }
}
