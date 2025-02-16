using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;

namespace WebApi.Tests.Integration.AuthController;

public class LoginTests(WebApiFactory webApiFactory) : IClassFixture<WebApiFactory>
{
    private readonly HttpClient _client = webApiFactory.CreateClient();

    [Fact]
    public async Task Login_ReturnsToken_WhenUserExist()
    {
        // Arrange
        var user = webApiFactory.GetTestUser();
        await webApiFactory.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/login", login);

        // Assert
        var message = await response.Content.ReadAsStringAsync();
        message.Should().Be("Invalid credentials");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var token = await response.Content.ReadFromJsonAsync<TokenDto>();
        token.Should().NotBeNull();
        token.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
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

    [Fact]
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
