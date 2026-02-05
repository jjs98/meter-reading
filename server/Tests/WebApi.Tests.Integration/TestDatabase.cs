using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Testcontainers.PostgreSql;
using TUnit.Core.Interfaces;
using static WebApi.Tests.Integration.WebApiFactory;

namespace WebApi.Tests.Integration;

public class TestDatabase : IAsyncInitializer, IAsyncDisposable
{
    public readonly PostgreSqlContainer DbContainer = new PostgreSqlBuilder("postgres")
        .WithPortBinding(5432, true)
        .Build();

    public async Task InitializeAsync()
    {
        await DbContainer.StartAsync();

        // Run migrations once when the container starts
        var connectionString = DbContainer.GetConnectionString();
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        await using var context = new AppDbContext(optionsBuilder.Options);
        await context.Database.MigrateAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await DbContainer.DisposeAsync();
        GC.SuppressFinalize(this);
    }

    public async Task ResetDatabaseAsync()
    {
        var connectionString = DbContainer.GetConnectionString();
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        await using var context = new AppDbContext(optionsBuilder.Options);
        await context.Readings.ExecuteDeleteAsync();
        await context.SharedMeters.ExecuteDeleteAsync();
        await context.Meters.ExecuteDeleteAsync();
        await context.UserRoles.ExecuteDeleteAsync();
        await context.Users.ExecuteDeleteAsync();
        await context.Roles.ExecuteDeleteAsync();
    }

    public async Task CreateTestUserAsync(TestUser user)
    {
        await using var dataSource = NpgsqlDataSource.Create(DbContainer.GetConnectionString());
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
}
