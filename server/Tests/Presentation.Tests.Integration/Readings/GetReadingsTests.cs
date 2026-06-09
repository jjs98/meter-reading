using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

public class GetReadingsTests : TestBase
{
    [Test]
    public async Task GetReadings_ReturnsReadings_WhenUserIsOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder.WithMeter("Location", userEntity, MeterType.Gas).Build();

        var readingBuilder = new ReadingBuilder(dbContext);
        readingBuilder
            .WithReading("100", DateTime.UtcNow.AddDays(-30), meterData.Meters[0])
            .WithReading("150", DateTime.UtcNow, meterData.Meters[0])
            .Build();

        var request = new GetReadingsEndpointRequest(meterData.Meters[0].Id);

        // Act
        var response = await client.GETAsync<
            GetReadingsEndpoint,
            GetReadingsEndpointRequest,
            IEnumerable<GetReadingsEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetReadings_ReturnsReadings_WhenUserHasSharedAccess()
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
        readingBuilder.WithReading("100", DateTime.UtcNow, meterData.Meters[0]).Build();

        var request = new GetReadingsEndpointRequest(meterData.Meters[0].Id);

        // Act
        var response = await client.GETAsync<
            GetReadingsEndpoint,
            GetReadingsEndpointRequest,
            IEnumerable<GetReadingsEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(1);
    }

    [Test]
    public async Task GetReadings_ReturnsUnauthorized_WhenUserIsNotOwnerOrShared()
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

        var request = new GetReadingsEndpointRequest(meterId);

        // Act
        var response = await client.GETAsync<
            GetReadingsEndpoint,
            GetReadingsEndpointRequest,
            IEnumerable<GetReadingsEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task GetReadings_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var request = new GetReadingsEndpointRequest(999999);

        // Act
        var response = await client.GETAsync<
            GetReadingsEndpoint,
            GetReadingsEndpointRequest,
            IEnumerable<GetReadingsEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task GetReadings_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var request = new GetReadingsEndpointRequest(1);

        // Act
        var response = await client.GETAsync<
            GetReadingsEndpoint,
            GetReadingsEndpointRequest,
            IEnumerable<GetReadingsEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
