using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;

namespace WebApi.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class RefreshTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task Refresh_ReturnsToken_WhenUserExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        await webApiFactory.Database.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };
        var loginResponse = await client.PostAsJsonAsync("api/auth/login", login);
        var loginToken = await loginResponse.Content.ReadFromJsonAsync<TokenDto>();

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        // Act
        var response = await client.PostAsync("api/auth/refresh", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var token = await response.Content.ReadFromJsonAsync<TokenDto>();
        token.Should().NotBeNull();
        token.Token.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task Refresh_ReturnsUnauthorized_WhenNoBearerTokenExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();

        // Act
        var response = await client.PostAsync("api/auth/refresh", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
