using Infrastructure.Configs;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<MeterEntity> Meters { get; set; }
    public DbSet<ReadingEntity> Readings { get; set; }
    public DbSet<RoleEntity> Roles { get; set; }
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<UserRoleEntity> UserRoles { get; set; }
    public DbSet<SharedMeterEntity> SharedMeters { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .ApplyConfiguration(new MetersConfig())
            .ApplyConfiguration(new ReadingsConfig())
            .ApplyConfiguration(new RolesConfig())
            .ApplyConfiguration(new UsersConfig())
            .ApplyConfiguration(new UserRolesConfig())
            .ApplyConfiguration(new SharedMetersConfig());
    }
}
