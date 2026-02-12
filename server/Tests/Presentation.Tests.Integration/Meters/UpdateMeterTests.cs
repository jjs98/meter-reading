using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class UpdateMeterTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task UpdateMeter_ReturnsNoContent_WhenUserIsOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Original Location", userData.Users[0], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var userId = userData.Users[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new UpdateMeterEndpointRequest(
            meterId,
            userId,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NoContent);
    }

    [Test]
    public async Task UpdateMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
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
            .WithMeter("Original Location", userData.Users[1], MeterType.Gas)
            .Build();
        var meterId = meterData.Meters[0].Id;
        var otherUserId = userData.Users[1].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new UpdateMeterEndpointRequest(
            meterId,
            otherUserId,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task UpdateMeter_ReturnsNotFound_WhenMeterDoesNotExist()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();
        var userId = userData.Users[0].Id;

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new UpdateMeterEndpointRequest(
            999999,
            userId,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task UpdateMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new UpdateMeterEndpointRequest(
            1,
            1,
            "Updated Location",
            "99999",
            "Updated Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.PUTAsync<
            UpdateMeterEndpoint,
            UpdateMeterEndpointRequest,
            EmptyResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
