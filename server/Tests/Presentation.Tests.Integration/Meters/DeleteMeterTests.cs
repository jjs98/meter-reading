using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class DeleteMeterTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task DeleteMeter_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location to delete", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new DeleteMeterEndpointRequest(meterId);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task DeleteMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
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
            .WithMeter("Location to delete", userData.Users[1], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new DeleteMeterEndpointRequest(meterId);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task DeleteMeter_ReturnsNotFound_WhenMeterDoesNotExist()
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

        var request = new DeleteMeterEndpointRequest(999999);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task DeleteMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new DeleteMeterEndpointRequest(1);

        // Act
        var response = await client.DELETEAsync<
            DeleteMeterEndpoint,
            DeleteMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
