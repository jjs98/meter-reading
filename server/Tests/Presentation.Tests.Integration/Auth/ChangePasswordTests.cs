using System.Net;
using System.Net.Http.Json;
using Application.DTOs;
using FluentAssertions;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class ChangePasswordTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task ChangePassword_ReturnsOk_WhenUserExistAndPasswordIsCorrect()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };
        var loginResponse = await client.PostAsJsonAsync("api/auth/login", login);
        var loginToken = await loginResponse.Content.ReadFromJsonAsync<TokenDto>();

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        var newPassword = "newPassword";

        var changePassword = new ChangePasswordDto
        {
            OldPassword = user.Password,
            NewPassword = newPassword,
        };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var newLogin = new UserLoginDto { Username = user.Username, Password = newPassword };
        var newLoginResponse = await client.PostAsJsonAsync("api/auth/login", newLogin);
        var token = await newLoginResponse.Content.ReadFromJsonAsync<TokenDto>();
        token.Should().NotBeNull();
        token.Token.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task ChangePassword_ReturnsUnauthorized_WhenUserExistAndPasswordIsIncorrect()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var login = new UserLoginDto { Username = user.Username, Password = user.Password };
        var loginResponse = await client.PostAsJsonAsync("api/auth/login", login);
        var loginToken = await loginResponse.Content.ReadFromJsonAsync<TokenDto>();

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        var changePassword = new ChangePasswordDto
        {
            OldPassword = "wrongPassword",
            NewPassword = "newPassword",
        };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var message = await response.Content.ReadFromJsonAsync<string>();
        message.Should().Be("Invalid credentials");
    }

    [Test]
    public async Task ChangePassword_ReturnsUnauthorized_WhenNoBearerTokenExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var changePassword = new ChangePasswordDto
        {
            OldPassword = "wrongPassword",
            NewPassword = "newPassword",
        };

        // Act
        var response = await client.PostAsJsonAsync("api/auth/changePassword", changePassword);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
