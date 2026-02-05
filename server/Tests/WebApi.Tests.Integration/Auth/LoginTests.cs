using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;
using WebApi.Tests.Integration.Builder;

namespace WebApi.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class LoginTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task Login_ReturnsToken_WhenUserExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var token = await response.Content.ReadFromJsonAsync<TokenDto>();
        token.Should().NotBeNull();
        token.Token.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task Login_ReturnsUnauthorized_WhenWrongPasswordIsUsed()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var login = new UserLoginDto { Username = user.Username, Password = "wrongpassword" };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("Invalid credentials");
    }

    [Test]
    public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var login = new UserLoginDto { Username = "nonexistent", Password = "nonexistent" };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("User with name nonexistent not found");
    }
}
