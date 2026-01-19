using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;

namespace WebApi.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class ChangePasswordTests(WebApiFactory webApiFactory)
{
    private readonly HttpClient _client = webApiFactory.CreateClient();

    [Test]
    public async Task ChangePassword_ReturnsOk_WhenUserExistAndPasswordIsCorrect()
    {
        // Arrange
        var user = webApiFactory.GetTestUser();
        await webApiFactory.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };
        var loginResponse = await _client.PostAsJsonAsync("api/auth/login", login);
        var loginToken = await loginResponse.Content.ReadFromJsonAsync<TokenDto>();

        _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        var newPassword = "newPassword";

        var changePassword = new ChangePasswordDto
        {
            OldPassword = user.Password,
            NewPassword = newPassword,
        };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var newLogin = new UserLoginDto { Username = user.Username, Password = newPassword };
        var newLoginResponse = await _client.PostAsJsonAsync("api/auth/login", newLogin);
        var token = await newLoginResponse.Content.ReadFromJsonAsync<TokenDto>();
        token.Should().NotBeNull();
        token.Token.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task ChangePassword_ReturnsUnauthorized_WhenUserExistAndPasswordIsIncorrect()
    {
        // Arrange
        var user = webApiFactory.GetTestUser();
        await webApiFactory.CreateTestUserAsync(user);
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };
        var loginResponse = await _client.PostAsJsonAsync("api/auth/login", login);
        var loginToken = await loginResponse.Content.ReadFromJsonAsync<TokenDto>();

        _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        var changePassword = new ChangePasswordDto
        {
            OldPassword = "wrongPassword",
            NewPassword = "newPassword",
        };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("Invalid credentials");
    }

    [Test]
    public async Task ChangePassword_ReturnsUnauthorized_WhenNoBearerTokenExist()
    {
        // Arrange
        var changePassword = new ChangePasswordDto
        {
            OldPassword = "wrongPassword",
            NewPassword = "newPassword",
        };

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
