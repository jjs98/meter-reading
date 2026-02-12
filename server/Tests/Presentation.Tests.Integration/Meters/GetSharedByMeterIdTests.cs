using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class GetSharedByMeterIdTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task GetSharedByMeterId_ReturnsSharedUsers_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        var sharedUser1 = webApiFactory.GetTestUser();
        var sharedUser2 = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder
            .WithUser(owner)
            .WithUser(sharedUser1)
            .WithUser(sharedUser2)
            .Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();

        meterBuilder
            .WithSharedMeter(meterData.Meters[0], userData.Users[1])
            .WithSharedMeter(meterData.Meters[0], userData.Users[2])
            .Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(owner.Username, owner.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new GetSharedByMeterIdEndpointRequest(meterData.Meters[0].Id);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(2);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsUnauthorized_WhenUserIsNotOwner()
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

        var request = new GetSharedByMeterIdEndpointRequest(meterId);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsEmptyList_WhenNoUsersShared()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(owner.Username, owner.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new GetSharedByMeterIdEndpointRequest(meterId);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result.Count()).IsEqualTo(0);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsNotFound_WhenMeterDoesNotExist()
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

        var request = new GetSharedByMeterIdEndpointRequest(999999);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task GetSharedByMeterId_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new GetSharedByMeterIdEndpointRequest(1);

        // Act
        var response = await client.GETAsync<
            GetSharedByMeterIdEndpoint,
            GetSharedByMeterIdEndpointRequest,
            IEnumerable<GetSharedByMeterIdEndpointResponse>
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
