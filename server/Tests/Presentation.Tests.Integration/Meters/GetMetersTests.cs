using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class GetMetersTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task GetMeters_ReturnsMeters_WhenUserHasMeters()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        meterBuilder
            .WithMeter("Location 1", userData.Users[0], MeterType.Gas)
            .WithMeter("Location 2", userData.Users[0], MeterType.Electricity)
            .Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetMeters_ReturnsEmptyList_WhenUserHasNoMeters()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        userBuilder.WithUser(user).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetMeters_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
