using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;

namespace Presentation.Tests.Integration.Meters;

public class CreateMeterTests : TestBase
{
    [Test]
    public async Task CreateMeter_ReturnsCreated_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new CreateMeterEndpointRequest(
            userEntity.Id,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Created);
        await Assert.That(response.Result.Location).IsEqualTo("Test Location");
        await Assert.That(response.Result.MeterNumber).IsEqualTo("12345");
        await Assert.That(response.Result.Type).IsEqualTo(MeterType.Electricity);
    }

    [Test]
    public async Task CreateMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new CreateMeterEndpointRequest(
            999999,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task CreateMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new CreateMeterEndpointRequest(
            1,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
