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

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .ApplyConfiguration(new MeterConfig())
            .ApplyConfiguration(new ReadingConfig())
            .ApplyConfiguration(new RoleConfig())
            .ApplyConfiguration(new UserConfig());
    }
}
