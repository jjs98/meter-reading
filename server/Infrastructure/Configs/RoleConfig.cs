using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class RoleConfig : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(m => new
        {
            m.Id,
            m.Name,
            m.UserId
        });
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.Name).IsRequired();
        builder.Property(m => m.UserId).IsRequired();
    }
}
