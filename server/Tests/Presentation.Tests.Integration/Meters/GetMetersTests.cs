using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public class GetMetersTests : TestBase
{
    [Test]
    public async Task GetMeters_ReturnsMeters_WhenUserHasMeters()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        var meterBuilder = new MeterBuilder(dbContext);
        meterBuilder
            .WithMeter("Location 1", userEntity, MeterType.Gas)
            .WithMeter("Location 2", userEntity, MeterType.Electricity)
            .Build();

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetMeters_ReturnsEmptyList_WhenUserHasNoMeters()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetMeters_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = Factory.CreateClient();

        // Act
        var response = await client.GETAsync<
            GetMetersEndpoint,
            EmptyRequest,
            IEnumerable<GetMetersEndpointResponse>
        >(new EmptyRequest());

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
