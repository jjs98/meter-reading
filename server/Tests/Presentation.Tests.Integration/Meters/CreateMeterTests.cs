using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Auth;
using Presentation.Endpoints.Meters;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class CreateMeterTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task CreateMeter_ReturnsCreated_WhenUserIsOwner()
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

        var request = new CreateMeterEndpointRequest(
            userId,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Created);
        await Assert.That(response.Result.Location).IsEqualTo("Test Location");
        await Assert.That(response.Result.MeterNumber).IsEqualTo("12345");
        await Assert.That(response.Result.Type).IsEqualTo(MeterType.Electricity);
    }

    [Test]
    public async Task CreateMeter_ReturnsUnauthorized_WhenUserIsNotOwner()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var user = webApiFactory.GetTestUser();
        using var dbContext = webApiFactory.CreateDbContext();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(user).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");

        var request = new CreateMeterEndpointRequest(
            999999,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task CreateMeter_ReturnsUnauthorized_WhenNoBearerToken()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var request = new CreateMeterEndpointRequest(
            1,
            "Test Location",
            "12345",
            "Addition",
            MeterType.Electricity
        );

        // Act
        var response = await client.POSTAsync<
            CreateMeterEndpoint,
            CreateMeterEndpointRequest,
            CreateMeterEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
