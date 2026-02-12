using FastEndpoints;
using Infrastructure;
using Presentation.Endpoints.Auth;
using Presentation.Tests.Integration.Builder;

namespace Presentation.Tests.Integration.Meters;

public abstract class MeterTestsBase(WebApiFactory webApiFactory)
{
    protected readonly WebApiFactory WebApiFactory = webApiFactory;

    protected async Task<HttpClient> CreateAuthenticatedClientAsync(
        WebApiFactory.TestUser user,
        AppDbContext dbContext
    )
    {
        var client = WebApiFactory.CreateClient();
        var userBuilder = new UserBuilder(dbContext);
        userBuilder.WithUser(user).Build();

        var loginResponse = await client.POSTAsync<
            LoginEndpoint,
            LoginEndpointRequest,
            LoginEndpointResponse
        >(new LoginEndpointRequest(user.Username, user.Password));

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {loginResponse.Result.Token}");
        return client;
    }
}
