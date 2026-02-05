using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class UserRolesConfig : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");

        builder.HasKey(userRole => new { userRole.UserId, userRole.RoleId });
        builder.Property(userRole => userRole.Id).UseIdentityColumn();
        builder.Property(userRole => userRole.CreateDate);
        builder.Property(userRole => userRole.UpdateDate);

        builder
            .HasOne(userRole => userRole.Role)
            .WithMany(role => role.UserRoles)
            .HasForeignKey(userRole => userRole.RoleId);
        builder
            .HasOne(userRole => userRole.User)
            .WithMany(user => user.UserRoles)
            .HasForeignKey(userRole => userRole.UserId);
    }
}
