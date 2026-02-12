using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class ShareMeterTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task ShareMeter_ReturnsOk_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to share", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var userId = userData.Users[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new ShareMeterEndpointRequest(meterId, userId, otherUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.MeterId).IsEqualTo(meterId);
        await Assert.That(response.Result.Username).IsEqualTo(otherUser.Username);
    }

    [Test]
    public async Task ShareMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        var thirdUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder
            .WithUser(user)
            .WithUser(otherUser)
            .WithUser(thirdUser)
            .Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to share", userData.Users[1], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new ShareMeterEndpointRequest(meterId, userData.Users[0].Id, thirdUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task ShareMeter_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).WithUser(otherUser).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new ShareMeterEndpointRequest(999999, userData.Users[0].Id, otherUser.Username);

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task ShareMeter_ReturnsNotFound_WhenTargetUserDoesNotExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to share", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new ShareMeterEndpointRequest(meterId, userData.Users[0].Id, "nonexistent_user");

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task ShareMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new ShareMeterEndpointRequest(1, 1, "someuser");

        // Act
        var response = await client.POSTAsync<
            ShareMeterEndpoint,
            ShareMeterEndpointRequest,
            ShareMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
