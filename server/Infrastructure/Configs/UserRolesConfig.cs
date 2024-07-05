using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class UserRolesConfig : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");

        builder.HasKey(m => new { m.UserId, m.RoleId, });
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);
    }
}
