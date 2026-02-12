using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Users;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Users;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class GetUserNameTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task GetUserName_ReturnsUserName_WhenUserHasSharedMeterFromOwner()
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

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new GetUserNameRequest(userData.Users[0].Id);

        // Act
        var response = await client.GETAsync<GetUserNameEndpoint, GetUserNameRequest, string>(
            request
        );

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        await Assert.That(response.Result).IsEqualTo(owner.Username);
    }

    [Test]
    public async Task GetUserName_ReturnsUnauthorized_WhenUserDoesNotHaveSharedMeter()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var owner = webApiFactory.GetTestUser();
        var otherUser = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).WithUser(otherUser).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        meterBuilder.WithMeter("Location", userData.Users[0], MeterType.Gas).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(otherUser.Username, otherUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new GetUserNameRequest(userData.Users[0].Id);

        // Act
        var response = await client.GETAsync<GetUserNameEndpoint, GetUserNameRequest, string>(
            request
        );

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task GetUserName_ReturnsNotFound_WhenUserDoesNotExist()
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

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(sharedUser.Username, sharedUser.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new GetUserNameRequest(999999);

        // Act
        var response = await client.GETAsync<GetUserNameEndpoint, GetUserNameRequest, string>(
            request
        );

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task GetUserName_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new GetUserNameRequest(1);

        // Act
        var response = await client.GETAsync<GetUserNameEndpoint, GetUserNameRequest, string>(
            request
        );

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
