using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class DeleteReadingTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task DeleteReading_ReturnsNoContent_WhenUserIsOwner()
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

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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

        meterBuilder.WithSharedMeter(meterData.Meters[0], userData.Users[1]).Build();

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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

        var readingBuilder = new ReadingBuilder(dbContext);
        var readingData = readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();
        var readingId = readingData.Readings[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(otherUser.Username, otherUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        userBuilder.WithUser(user).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
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
