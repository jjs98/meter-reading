using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class RevokeMeterTests : TestBase
{
    [Test]
    public async Task RevokeMeter_ReturnsNoContent_WhenUserIsOwner()
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
            .WithMeter("Location to revoke", userEntity, MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var otherUserId = userData.Users[0].Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userData.Users[0]).Build();

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
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var owner = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to revoke", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var sharedUserId = userEntity.Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userEntity).Build();

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
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new RevokeMeterEndpointRequest(999999, userEntity.Id);

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
        using var client = Factory.CreateClient();
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
