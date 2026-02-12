using Application;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Presentation;

namespace Bootstrap;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.RegisterPresentationModule(builder.Configuration);
        builder.Services.RegisterInfrastructureModule(builder.Configuration);
        builder.Services.RegisterApplicationModule();

        var app = builder.Build();

        app.UsePresentationModule();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();
        }

        app.Run();
    }
}
