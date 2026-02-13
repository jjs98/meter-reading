using System.Net;
using System.Net.Mime;
using System.Text.Json;
using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
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
                o.ShortSchemaNames = true;
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
            .UseFastEndpoints(c =>
            {
                c.Endpoints.Configurator = epd =>
                {
                    epd.AllowAnonymous();
                    epd.Description(b =>
                        b.Produces<string>(
                                (int)HttpStatusCode.Unauthorized,
                                MediaTypeNames.Text.Plain
                            )
                            .Produces<string>(
                                (int)HttpStatusCode.InternalServerError,
                                MediaTypeNames.Text.Plain
                            )
                    );
                    epd.PostProcessor<ErrorHandlingFilter>(Order.After);
                };
                c.Endpoints.ShortNames = true;
                c.Endpoints.RoutePrefix = "api";
                c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                c.Binding.UsePropertyNamingPolicy = true;
            });

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerGen(
                config => { },
                uiConfig =>
                {
                    uiConfig.ShowOperationIDs();
                }
            );
        }

        return app;
    }
}
