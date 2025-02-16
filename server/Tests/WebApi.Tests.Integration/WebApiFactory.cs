using Bogus;
using Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Npgsql;
using Testcontainers.PostgreSql;

namespace WebApi.Tests.Integration;

public class WebApiFactory : WebApplicationFactory<IApiMarker>, IAsyncLifetime
{
    public List<TestUser> TestUsers { get; } = [];

    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithPortBinding(5432, true)
        .Build();

    private readonly Faker<TestUser> _userGenerator = new Faker<TestUser>()
        .RuleFor(u => u.Username, f => f.Person.UserName)
        .RuleFor(u => u.Password, f => "password")
        .RuleFor(u => u.HashedPassword, BCrypt.Net.BCrypt.HashPassword("password"))
        .RuleFor(u => u.Role, "User");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders();
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<AppDbContext>();

            services.AddPooledDbContextFactory<AppDbContext>(options =>
            {
                options.UseNpgsql(_dbContainer.GetConnectionString());
            });
        });
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.DisposeAsync();
    }

    public static TestUser GetAdminUser() =>
        new()
        {
            Username = "admin",
            Password = "password",
            HashedPassword = BCrypt.Net.BCrypt.HashPassword("password"),
            Role = "Admin"
        };

    public TestUser GetTestUser()
    {
        var user = _userGenerator.Generate();
        TestUsers.Add(user);
        return user;
    }

    public async Task CreateTestUserAsync(TestUser user)
    {
        await using var dataSource = NpgsqlDataSource.Create(_dbContainer.GetConnectionString());
        await using var command = dataSource.CreateCommand();
        command.CommandText = $"""
            INSERT INTO "Users" ("Username", "Password", "CreateDate")
            SELECT '{user.Username}', '{user.HashedPassword}', NOW()
            WHERE NOT EXISTS (SELECT 1 FROM "Users" WHERE "Username" = '{user.Username}');

            INSERT INTO "Roles" ("Name", "CreateDate")
            SELECT '{user.Role}', NOW()
            WHERE NOT EXISTS (SELECT 1 FROM "Roles" WHERE "Name" = '{user.Role}');

            DO $$
            DECLARE
                RoleId integer = "Id" FROM "Roles" WHERE "Name" = '{user.Role}';
                UserId integer = "Id" FROM "Users" WHERE "Username" = '{user.Username}';

            BEGIN
                INSERT INTO "UserRoles" ("RoleId", "UserId", "CreateDate")
                SELECT RoleId, UserId, NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "UserRoles" WHERE "RoleId" = RoleId AND "UserId" = UserId);
            END $$;
            """;

        await command.ExecuteNonQueryAsync();
    }

    public class TestUser
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string HashedPassword { get; set; }
        public required string Role { get; set; }
    }
}
