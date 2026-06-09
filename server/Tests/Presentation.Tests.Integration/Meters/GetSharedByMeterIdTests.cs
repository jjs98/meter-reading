using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class GetSharedByMeterIdTests : TestBase
{
    [Test]
    public async Task GetSharedByMeterId_ReturnsSharedUsers_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var sharedUser1 = GetTestUser();
        var sharedUser2 = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(sharedUser1).WithUser(sharedUser2).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();

        meterBuilder
            .WithSharedMeter(meterData.Meters[0], userData.Users[0])
            .WithSharedMeter(meterData.Meters[0], userData.Users[1])
            .Build();

        var request = new GetSharedByMeterIdEndpointRequest(meterData.Meters[0].Id);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var otherUser = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new GetSharedByMeterIdEndpointRequest(meterId);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsEmptyList_WhenNoUsersShared()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();
        var meterId = meterData.Meters[0].Id;

        var request = new GetSharedByMeterIdEndpointRequest(meterId);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new GetSharedByMeterIdEndpointRequest(999999);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new GetSharedByMeterIdEndpointRequest(1);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
