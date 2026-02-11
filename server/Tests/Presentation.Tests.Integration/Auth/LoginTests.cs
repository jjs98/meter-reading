using System.Net;
using System.Net.Http.Json;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Auth;

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

        // Act
        var response = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Token).IsNotNullOrEmpty();
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

        // Act
        var response = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, "wrongpassword"));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
        var message = await response.Response.Content.ReadAsStringAsync();
        await Assert.That(message).IsEqualTo("Invalid credentials");
    }

    [Test]
    public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();

        // Act
        var response = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest("nonexistent", "nonexistent"));

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
        var message = await response.Response.Content.ReadAsStringAsync();
        await Assert.That(message).IsEqualTo("User with name nonexistent not found");
    }
}
