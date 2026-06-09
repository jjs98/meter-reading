using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class UpdateMeterTests : TestBase
{
    [Test]
    public async Task UpdateMeter_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Original Location", userEntity, MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var userId = userEntity.Id;

        var request = new UpdateMeterEndpointRequest(
            meterId,
            userId,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task UpdateMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
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
            .WithMeter("Original Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var otherUserId = userData.Users[0].Id;

        var request = new UpdateMeterEndpointRequest(
            meterId,
            otherUserId,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task UpdateMeter_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new UpdateMeterEndpointRequest(
            999999,
            userEntity.Id,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task UpdateMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new UpdateMeterEndpointRequest(
            1,
            1,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
