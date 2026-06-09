using System.Net;
using Domain.Enums;
using FastEndpoints;
using Presentation.Endpoints.Users;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Users;

public class GetUserNameTests : TestBase
{
    [Test]
    public async Task GetUserName_ReturnsUserName_WhenUserHasSharedMeterFromOwner()
    {
        // Arrange
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var owner = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();

        meterBuilder.WithSharedMeter(meterData.Meters[0], userEntity).Build();

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
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var owner = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        meterBuilder.WithMeter("Location", userData.Users[0], MeterType.Gas).Build();

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
        var user = GetTestUser();
        using var dbContext = CreateDbContext();
        (var client, var userEntity) = await CreateAuthenticatedClientAsync(user, dbContext);
        var owner = GetTestUser();
        var userBuilder = new UserBuilder(dbContext);
        var userData = userBuilder.WithUser(owner).Build();

        var meterBuilder = new MeterBuilder(dbContext);
        var meterData = meterBuilder
            .WithMeter("Location", userData.Users[0], MeterType.Gas)
            .Build();

        meterBuilder.WithSharedMeter(meterData.Meters[0], userEntity).Build();

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
        using var client = Factory.CreateClient();
        var request = new GetUserNameRequest(1);

        // Act
        var response = await client.GETAsync<GetUserNameEndpoint, GetUserNameRequest, string>(
            request
        );

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.Unauthorized);
    }
}
