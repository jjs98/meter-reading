using Domain.Models;
using Infrastructure.Configs;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<Meter> Meters { get; set; }
    public DbSet<Reading> Readings { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .ApplyConfiguration(new MetersConfig())
            .ApplyConfiguration(new ReadingsConfig())
            .ApplyConfiguration(new RolesConfig())
            .ApplyConfiguration(new UsersConfig())
            .ApplyConfiguration(new UserRolesConfig());
    }
}
