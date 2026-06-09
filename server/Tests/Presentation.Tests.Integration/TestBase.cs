using Bogus;
using Bootstrap;
using FastEndpoints;
using Infrastructure;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Presentation.Endpoints.Auth;
using Presentation.Tests.Integration.Builder;
using TUnit.AspNetCore;

namespace Presentation.Tests.Integration;

public abstract class TestBase : WebApplicationTest<WebApiFactory, Program>
{
    [ClassDataSource<TestDatabase>(Shared = SharedType.PerTestSession)]
    public TestDatabase Database { get; init; } = null!;

    private readonly Faker<TestUser> _userGenerator = new Faker<TestUser>()
        .RuleFor(u => u.Username, f => f.Person.UserName)
        .RuleFor(u => u.Password, f => "password")
        .RuleFor(u => u.HashedPassword, BCrypt.Net.BCrypt.HashPassword("password"))
        .RuleFor(u => u.Role, f => "User");

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
        return _userGenerator.Generate();
    }

    public AppDbContext CreateDbContext()
    {
        return new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(Database.DbContainer.GetConnectionString())
                .Options
        );
    }

    public async Task<(HttpClient, UserEntity)> CreateAuthenticatedClientAsync(
        TestUser user,
        AppDbContext dbContext
    )
    {
        var client = Factory.CreateClient();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var userEntity = userData.Users[0];

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");
        return (client, userEntity);
    }

    public class TestUser
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string HashedPassword { get; set; }
        public required string Role { get; set; }
    }
}
