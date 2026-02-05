using System.Net;
using System.Net.Http.Json;
using FluentAssertions;

namespace WebApi.Tests.Integration.Auth;

[ClassDataSource<WebApiFactory>(Shared = SharedType.PerClass)]
public class HashPasswordTests(WebApiFactory webApiFactory)
{
    [Test]
    public async Task HashPassword_ReturnsHashedPassword()
    {
        // Arrange
        using var client = webApiFactory.CreateClient();
        var password = "password";

        // Act
        var response = await client.PostAsJsonAsync("api/auth/hash", password);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var hashedPassword = await response.Content.ReadFromJsonAsync<string>();
        hashedPassword.Should().NotBeNullOrEmpty();
        hashedPassword.Should().NotBe(password);
    }
}
