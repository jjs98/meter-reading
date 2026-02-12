using System.Net;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class RefreshTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task Refresh_ReturnsToken_WhenUserExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        ;
        var loginToken = loginResponse.Result;

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginToken!.Token}");

        // Act
        var response = await client.POSTAsync<
            RefreshEndpoint,
            EmptyRequest,
            RefreshEndpointResponse
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Token).IsNotNullOrEmpty();
    }

    [Test]
    public async Task Refresh_ReturnsUnauthorized_WhenNoBearerTokenExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();

        // Act
        var response = await client.POSTAsync<
            RefreshEndpoint,
            EmptyRequest,
            RefreshEndpointResponse
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
