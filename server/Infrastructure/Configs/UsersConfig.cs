using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configs;

public class UsersConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);
        builder.Property(user => user.Id).UseIdentityColumn();
        builder.Property(user => user.CreateDate);
        builder.Property(user => user.UpdateDate);

        builder.Property(user => user.Username).IsRequired();
        builder.Property(user => user.Password).IsRequired();

        builder.Property(user => user.FirstName);
        builder.Property(user => user.LastName);
        builder.Property(user => user.Email);
    }
}
