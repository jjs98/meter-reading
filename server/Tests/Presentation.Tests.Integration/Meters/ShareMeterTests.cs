using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class ShareMeterTests : TestBase
{
    [Test]
    public async Task ShareMeter_ReturnsOk_WhenUserIsOwner()
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
            .WithMeter("Location to share", userEntity, MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var userId = userEntity.Id;

        var request = new ShareMeterEndpointRequest(meterId, userId, otherUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.MeterId).IsEqualTo(meterId);
        await Assert.That(response.Result.Username).IsEqualTo(otherUser.Username);
    }

    [Test]
    public async Task ShareMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var otherUser = GetTestUser();
        var thirdUser = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(otherUser).WithUser(thirdUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to share", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new ShareMeterEndpointRequest(meterId, userEntity.Id, thirdUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task ShareMeter_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var otherUser = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(otherUser).Build();

        var request = new ShareMeterEndpointRequest(999999, userEntity.Id, otherUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task ShareMeter_ReturnsNotFound_WhenTargetUserDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to share", userEntity, MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new ShareMeterEndpointRequest(meterId, userEntity.Id, "nonexistent_user");

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task ShareMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new ShareMeterEndpointRequest(1, 1, "someuser");

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
