using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class GetSharedMetersTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task GetSharedMeters_ReturnsSharedMeters_WhenUserHasSharedMeters()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        var sharedUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).WithUser(sharedUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Shared Location 1", userData.Users[0], MeterType.Gas)
            .WithMeter("Shared Location 2", userData.Users[0], MeterType.Electricity)
            .Build();

        meterBuilder
            .WithSharedMeter(meterData.Meters[0], userData.Users[1])
            .WithSharedMeter(meterData.Meters[1], userData.Users[1])
            .Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        // Act
        var response = await client.GETAsync<
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetSharedMeters_ReturnsEmptyList_WhenUserHasNoSharedMeters()
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
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetSharedMeters_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();

        // Act
        var response = await client.GETAsync<
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
