namespace WebApi;

public static class Module
{
    public static IServiceCollection RegisterWebApiModule(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        return services;
    }
}
