using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Presentation;

public static class Module
{
    public static IServiceCollection RegisterPresentationModule(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddCors()
            .AddAuthenticationJwtBearer(settings =>
            {
                settings.SigningKey =
                    configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("Jwt:Key not found.");
            })
            .AddAuthorization()
            .AddFastEndpoints()
            .SwaggerDocument(o =>
            {
                o.AutoTagPathSegmentIndex = 2;
            });

        return services;
    }

    public static WebApplication UsePresentationModule(this WebApplication app)
    {
        app.UseCors(app => app.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())
            .UseHttpsRedirection()
            .UseRouting()
            .UseAuthentication()
            .UseAuthorization()
            .UseFastEndpoints();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerGen();
        }

        return app;
    }
}
