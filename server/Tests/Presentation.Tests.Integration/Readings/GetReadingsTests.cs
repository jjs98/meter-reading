using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Readings;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Readings;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class GetReadingsTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task GetReadings_ReturnsReadings_WhenUserIsOwner()
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
        readingBuilder
            .WithReading("100", DateTime.UtcNow.AddDays(-30), meterData.Meters[0])
            .WithReading("150", DateTime.UtcNow, meterData.Meters[0])
            .Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        readingBuilder
            .WithReading("100", DateTime.UtcNow, meterData.Meters[0])
            .Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

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
        using var client = webApiFactory.CreateClient();
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
