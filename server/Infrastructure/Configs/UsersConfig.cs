using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class UsersConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).UseIdentityColumn();
        builder.Property(m => m.CreateDate);
        builder.Property(m => m.UpdateDate);

        builder.Property(m => m.Username).IsRequired();
        builder.Property(m => m.Password).IsRequired();

        builder.Property(m => m.FirstName);
        builder.Property(m => m.LastName);
        builder.Property(m => m.Email);
    }
}
