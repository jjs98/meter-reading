using System.Net;
using System.Net.Http.Json;
using FluentAssertions;

namespace WebApi.Tests.Integration.Auth;

public class HashPasswordTests(WebApiFactory webApiFactory) : IClassFixture<WebApiFactory>
{
    private readonly HttpClient _client = webApiFactory.CreateClient();

    [Fact]
    public async Task HashPassword_ReturnsHashedPassword()
    {
        // Arrange
        var password = "password";

        // Act
        var response = await _client.PostAsJsonAsync("api/auth/hash", password);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var hashedPassword = await response.Content.ReadFromJsonAsync<string>();
        hashedPassword.Should().NotBeNullOrEmpty();
        hashedPassword.Should().NotBe(password);
    }
}
