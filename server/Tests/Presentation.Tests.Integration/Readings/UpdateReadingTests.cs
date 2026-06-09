using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

public class UpdateReadingTests : TestBase
{
    [Test]
    public async Task UpdateReading_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();
        var meterId = meterData.Meters[0].Id;

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow.AddDays(-1), meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var newReadingDate = DateTime.UtcNow;
        var request = new UpdateReadingEndpointRequest(readingId, meterId, "200", newReadingDate);

        // Act
        var response = await client.PUTAsync<
            UpdateReadingEndpoint,
            UpdateReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task UpdateReading_ReturnsNoContent_WhenUserHasSharedAccess()
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

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow.AddDays(-1), meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var request = new UpdateReadingEndpointRequest(readingId, meterId, "300", DateTime.UtcNow);

        // Act
        var response = await client.PUTAsync<
            UpdateReadingEndpoint,
            UpdateReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task UpdateReading_ReturnsUnauthorized_WhenUserIsNotOwnerOrShared()
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

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow.AddDays(-1), meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var request = new UpdateReadingEndpointRequest(readingId, meterId, "999", DateTime.UtcNow);

        // Act
        var response = await client.PUTAsync<
            UpdateReadingEndpoint,
            UpdateReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task UpdateReading_ReturnsNotFound_WhenReadingDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();
        var meterId = meterData.Meters[0].Id;

        var request = new UpdateReadingEndpointRequest(999999, meterId, "200", DateTime.UtcNow);

        // Act
        var response = await client.PUTAsync<
            UpdateReadingEndpoint,
            UpdateReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task UpdateReading_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new UpdateReadingEndpointRequest(1, 1, "200", DateTime.UtcNow);

        // Act
        var response = await client.PUTAsync<
            UpdateReadingEndpoint,
            UpdateReadingEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
