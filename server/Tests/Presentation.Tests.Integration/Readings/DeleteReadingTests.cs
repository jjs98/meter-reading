using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

public class DeleteReadingTests : TestBase
{
    [Test]
    public async Task DeleteReading_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var request = new DeleteReadingEndpointRequest(readingId);

        // Act
        var response = await client.DELETEAsync<
            DeleteReadingEndpoint,
            DeleteReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task DeleteReading_ReturnsNoContent_WhenUserHasSharedAccess()
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

        meterBuilder.WithSharedMeter(meterData.Meters[0], userEntity).Build();

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var request = new DeleteReadingEndpointRequest(readingId);

        // Act
        var response = await client.DELETEAsync<
            DeleteReadingEndpoint,
            DeleteReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task DeleteReading_ReturnsUnauthorized_WhenUserIsNotOwnerOrShared()
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

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var request = new DeleteReadingEndpointRequest(readingId);

        // Act
        var response = await client.DELETEAsync<
            DeleteReadingEndpoint,
            DeleteReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task DeleteReading_ReturnsNotFound_WhenReadingDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new DeleteReadingEndpointRequest(999999);

        // Act
        var response = await client.DELETEAsync<
            DeleteReadingEndpoint,
            DeleteReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task DeleteReading_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new DeleteReadingEndpointRequest(1);

        // Act
        var response = await client.DELETEAsync<
            DeleteReadingEndpoint,
            DeleteReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
