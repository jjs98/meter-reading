using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class RolesConfig : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(role => role.Id);
        builder.Property(role => role.Id).UseIdentityColumn();
        builder.Property(role => role.CreateDate);
        builder.Property(role => role.UpdateDate);

        builder.HasIndex(role => role.Name).IsUnique();

        builder.Property(role => role.Name).IsRequired();
    }
}
