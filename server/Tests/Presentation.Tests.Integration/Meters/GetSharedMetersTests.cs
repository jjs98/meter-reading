using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class GetSharedMetersTests : TestBase
{
    [Test]
    public async Task GetSharedMeters_ReturnsSharedMeters_WhenUserHasSharedMeters()
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
            .WithMeter("Shared Location 1", userData.Users[0], MeterType.Gas)
            .WithMeter("Shared Location 2", userData.Users[0], MeterType.Electricity)
            .Build();

        meterBuilder
            .WithSharedMeter(meterData.Meters[0], userEntity)
            .WithSharedMeter(meterData.Meters[1], userEntity)
            .Build();

        // Act
        var response = await client.GETAsync<
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetSharedMeters_ReturnsEmptyList_WhenUserHasNoSharedMeters()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        // Act
        var response = await client.GETAsync<
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetSharedMeters_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();

        // Act
        var response = await client.GETAsync<
            GetSharedMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetSharedMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
