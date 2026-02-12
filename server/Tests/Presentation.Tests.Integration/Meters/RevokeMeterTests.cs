using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class RevokeMeterTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task RevokeMeter_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to revoke", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var otherUserId = userData.Users[1].Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userData.Users[1]).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new RevokeMeterEndpointRequest(meterId, otherUserId);

        // Act
        var response = await client.DELETEAsync<
            RevokeMeterEndpoint,
            RevokeMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task RevokeMeter_ReturnsNoContent_WhenSharedUserRevokesOwnAccess()
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
            .WithMeter("Location to revoke", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var sharedUserId = userData.Users[1].Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userData.Users[1]).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new RevokeMeterEndpointRequest(meterId, sharedUserId);

        // Act
        var response = await client.DELETEAsync<
            RevokeMeterEndpoint,
            RevokeMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task RevokeMeter_ReturnsNotFound_WhenMeterDoesNotExist()
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
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new RevokeMeterEndpointRequest(999999, userData.Users[0].Id);

        // Act
        var response = await client.DELETEAsync<
            RevokeMeterEndpoint,
            RevokeMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task RevokeMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new RevokeMeterEndpointRequest(1, 1);

        // Act
        var response = await client.DELETEAsync<
            RevokeMeterEndpoint,
            RevokeMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
