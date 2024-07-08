﻿using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class Module
{
    public static IServiceCollection RegisterApplicationModule(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IMeterService, MeterService>();
        services.AddScoped<IReadingService, ReadingService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserRoleService, UserRoleService>();

        return services;
    }
}
