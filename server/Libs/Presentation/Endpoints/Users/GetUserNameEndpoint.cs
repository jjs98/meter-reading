using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Users;

public record GetUserNameRequest([property: RouteParam] int Id);

public class GetUserNameEndpoint(
    ILogger<GetUserNameEndpoint> logger,
    IUserService userService,
    IMeterService meterService
) : Endpoint<GetUserNameRequest, string>
{
    public override void Configure()
    {
        Get("/api/user/{Id}/name");
        Roles("User");
    }

    public override async Task HandleAsync(GetUserNameRequest req, CancellationToken ct)
    {
        var requestingUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");

        try
        {
            var meters = await meterService.GetShared(requestingUserId);

            if (!meters.Any(x => x.UserId == req.Id))
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            var user = await userService.GetById(req.Id);
            await Send.OkAsync(user.GetName(), ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            logger.LogError(ex, "An error occurred while getting user by id for id {Id}", req.Id);
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
