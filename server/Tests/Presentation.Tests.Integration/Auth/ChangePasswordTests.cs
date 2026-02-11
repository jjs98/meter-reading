using System.Net;
using Domain.Models;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class ChangePasswordTests(WebApiFactory webApiFactory)
{
    [Test]
    [NotInParallel]
    public async Task ChangePassword_ReturnsOk_WhenUserExistAndPasswordIsCorrect()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        var loginToken = loginResponse.Result;

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        var newPassword = "newPassword";

        // Act
        var response = await client.POSTAsync<
            ChangePasswordEndpoint,
            ChangePasswordEndpointRequest,
            EmptyResponse
        >(new ChangePasswordEndpointRequest(user.Password, newPassword));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);

        var newLoginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, newPassword));
        await Assert.That(newLoginResponse.Result.Token).IsNotNullOrEmpty();
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
        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        var loginToken = loginResponse.Result;

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        // Act
        var response = await client.POSTAsync<
            ChangePasswordEndpoint,
            ChangePasswordEndpointRequest,
            EmptyResponse
        >(new ChangePasswordEndpointRequest("wrongPassword", "newPassword"));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
        var message = await response.Response.Content.ReadAsStringAsync();
        await Assert.That(message).IsEqualTo("Invalid credentials");
    }

    [Test]
    public async Task ChangePassword_ReturnsUnauthorized_WhenNoBearerTokenExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var changePassword = new PasswordChange("wrongPassword", "newPassword");

        // Act
        var response = await client.POSTAsync<
            ChangePasswordEndpoint,
            ChangePasswordEndpointRequest,
            EmptyResponse
        >(new ChangePasswordEndpointRequest("wrongPassword", "newPassword"));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
