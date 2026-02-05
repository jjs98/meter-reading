using Bogus;
using Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TUnit.AspNetCore;

namespace WebApi.Tests.Integration;

public class WebApiFactory : TestWebApplicationFactory<Program>
{
    [ClassDataSource<TestDatabase>(Shared = SharedType.PerTestSession)]
    public required TestDatabase Database { get; init; } = null!;

    private readonly Faker<TestUser> _userGenerator = new Faker<TestUser>()
        .RuleFor(u => u.Username, f => f.Person.UserName)
        .RuleFor(u => u.Password, f => "password")
        .RuleFor(u => u.HashedPassword, BCrypt.Net.BCrypt.HashPassword("password"))
        .RuleFor(u => u.Role, "User");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IDbContextFactory<AppDbContext>>();

            services.AddDbContextFactory<AppDbContext>(options =>
            {
                options.UseNpgsql(Database.DbContainer.GetConnectionString());
            });
        });
    }

    public static TestUser GetAdminUser() =>
        new()
        {
            Username = "admin",
            Password = "password",
            HashedPassword = BCrypt.Net.BCrypt.HashPassword("password"),
            Role = "Admin",
        };

    public TestUser GetTestUser()
    {
        var user = _userGenerator.Generate();
        return user;
    }

    public class TestUser
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string HashedPassword { get; set; }
        public required string Role { get; set; }
    }
}
