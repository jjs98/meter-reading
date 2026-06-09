using System.Net;
using FastEndpoints;
using Presentation.Endpoints.Auth;

namespace Presentation.Tests.Integration.Auth;

public class HashPasswordTests : TestBase
{
    [Test]
    public async Task HashPassword_ReturnsHashedPassword()
    {
        // Arrange
        using var client = Factory.CreateClient();
        var password = "password";
        var request = new HashEndpointRequest(password);

        // Act
        var response = await client.POSTAsync<
            HashEndpoint,
            HashEndpointRequest,
            HashEndpointResponse
        >(request);

        // Assert
        await Assert.That(response.Response.StatusCode).IsEqualTo(HttpStatusCode.OK);
        var hashedPassword = response.Result.HashedPassword;
        await Assert.That(hashedPassword).IsNotNull();
        await Assert.That(hashedPassword).IsNotEqualTo(password);
    }
}
