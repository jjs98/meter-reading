using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class DeleteMeterTests : TestBase
{
    [Test]
    public async Task DeleteMeter_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to delete", userEntity, MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new DeleteMeterEndpointRequest(meterId);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task DeleteMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var userBuilder = new UserBuilder(dbContext);
        var otherUser = GetTestUser();
        var userData = userBuilder.WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to delete", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new DeleteMeterEndpointRequest(meterId);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task DeleteMeter_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new DeleteMeterEndpointRequest(999999);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task DeleteMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new DeleteMeterEndpointRequest(1);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
