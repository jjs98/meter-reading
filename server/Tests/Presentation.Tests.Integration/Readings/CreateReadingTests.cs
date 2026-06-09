using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

public class CreateReadingTests : TestBase
{
    [Test]
    public async Task CreateReading_ReturnsCreated_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();
        var meterId = meterData.Meters[0].Id;

        var readingDate = DateTime.UtcNow;
        var request = new CreateReadingEndpointRequest(meterId, "12345", readingDate);

        // Act
        var response = await client.POSTAsync<
            CreateReadingEndpoint,
            CreateReadingEndpointRequest,
            CreateReadingEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Created);
        await Assert.That(response.Result.MeterId).IsEqualTo(meterId);
        await Assert.That(response.Result.Number).IsEqualTo("12345");
    }

    [Test]
    public async Task CreateReading_ReturnsCreated_WhenUserHasSharedAccess()
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
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userEntity).Build();

        var readingDate = DateTime.UtcNow;
        var request = new CreateReadingEndpointRequest(meterId, "67890", readingDate);

        // Act
        var response = await client.POSTAsync<
            CreateReadingEndpoint,
            CreateReadingEndpointRequest,
            CreateReadingEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Created);
        await Assert.That(response.Result.Number).IsEqualTo("67890");
    }

    [Test]
    public async Task CreateReading_ReturnsUnauthorized_WhenUserIsNotOwnerOrShared()
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
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var request = new CreateReadingEndpointRequest(meterId, "12345", DateTime.UtcNow);

        // Act
        var response = await client.POSTAsync<
            CreateReadingEndpoint,
            CreateReadingEndpointRequest,
            CreateReadingEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task CreateReading_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new CreateReadingEndpointRequest(1, "12345", DateTime.UtcNow);

        // Act
        var response = await client.POSTAsync<
            CreateReadingEndpoint,
            CreateReadingEndpointRequest,
            CreateReadingEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
