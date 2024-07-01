using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class Module
{
    public static IServiceCollection RegisterApplicationModule(this IServiceCollection services)
    {
        services.AddScoped<IMeterService, MeterService>();

        return services;
    }
}
