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
        services.AddDbContext<AppDbContext>(
            options => options.UseNpgsql(configuration.GetConnectionString(nameof(AppDbContext))),
            ServiceLifetime.Singleton
        );

        services.AddHostedService<MigrationService>();

        services.AddScoped<IMeterRepository, MeterRepository>();

        return services;
    }
}
