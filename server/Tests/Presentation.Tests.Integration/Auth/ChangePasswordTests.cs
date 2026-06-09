using System.Net;
using Domain.Models;
using FastEndpoints;
using Presentation.Endpoints.Auth;

namespace Presentation.Tests.Integration.Auth;

public class ChangePasswordTests : TestBase
{
    [Test]
    [NotInParallel]
    public async Task ChangePassword_ReturnsOk_WhenUserExistAndPasswordIsCorrect()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

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
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

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
        using var client = Factory.CreateClient();
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
