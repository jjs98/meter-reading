using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using Domain.Exceptions;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record GetSharedMetersEndpointResponse(
    int Id,
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public class GetSharedMetersEndpoint(
    IMeterService meterService,
    ILogger<GetSharedMetersEndpoint> logger
) : Endpoint<EmptyRequest, IEnumerable<GetSharedMetersEndpointResponse>>
{
    public override void Configure()
    {
        Get("/api/meter/shared");
        Roles("User");
        Description(d =>
            d.Produces<IEnumerable<GetSharedMetersEndpointResponse>>((int)HttpStatusCode.OK)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.NotFound, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            var meters = await meterService.GetShared(userId);
            var response = meters.Select(m => new GetSharedMetersEndpointResponse(
                m.Id,
                m.UserId,
                m.Location,
                m.MeterNumber,
                m.Addition,
                m.Type
            ));
            await Send.OkAsync(response, ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            logger.LogError(ex, "An error occurred while getting meter share");
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
