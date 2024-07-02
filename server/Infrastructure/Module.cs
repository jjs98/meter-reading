using Domain.Interfaces;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class Module
{
    public static IServiceCollection RegisterInfrastructureModule(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        AddDbContextPool<AppDbContext>(services, configuration, nameof(AppDbContext));

        services.AddHostedService<MigrationService>();

        services.AddScoped<IMeterRepository, MeterRepository>();

        return services;
    }

    private static void AddDbContextPool<TDbContext>(
        this IServiceCollection services,
        IConfiguration configuration,
        string connectionStringName
    )
        where TDbContext : DbContext
    {
        services.AddPooledDbContextFactory<TDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString(connectionStringName);

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    $"Connection string '{connectionStringName}' not found."
                );
            }

            options.UseNpgsql(connectionString);
        });
    }
}
