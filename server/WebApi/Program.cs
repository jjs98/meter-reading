using Application;
using Infrastructure;

namespace WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.RegisterWebApiModule(builder.Configuration);
        builder.Services.RegisterInfrastructureModule(builder.Configuration);
        builder.Services.RegisterApplicationModule();

        var app = builder.Build();

        app.UseCors(app => app.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment()) { }
        app.UseSwagger();
        app.UseSwaggerUI();

        app.Run();
    }
}
