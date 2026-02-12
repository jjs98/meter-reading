using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class CreateReadingTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task CreateReading_ReturnsCreated_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        var sharedUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).WithUser(sharedUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        meterBuilder.WithSharedMeter(meterData.Meters[0], userData.Users[1]).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(otherUser.Username, otherUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
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
