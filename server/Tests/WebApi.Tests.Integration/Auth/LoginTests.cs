using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;

namespace WebApi.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class LoginTests(WebApiFactory webApiFactory)
{
    private readonly HttpClient _client = webApiFactory.CreateClient();

    [Test]
    public async Task Login_ReturnsToken_WhenUserExist()
    {
        // Arrange
        var user = webApiFactory.GetTestUser();
        await webApiFactory.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/login", login);

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
        var user = webApiFactory.GetTestUser();
        await webApiFactory.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = "wrongpassword" };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("Invalid credentials");
    }

    [Test]
    public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
    {
        // Arrange
        var login = new UserLoginDto { Username = "nonexistent", Password = "nonexistent" };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("User with name nonexistent not found");
    }
}
