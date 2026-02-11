using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using Domain.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Readings;

public record GetReadingsEndpointRequest(int MeterId);

public class GetReadingsEndpoint(
    IReadingService readingService,
    IMeterService meterService,
    ILogger<GetReadingsEndpoint> logger
) : Endpoint<GetReadingsEndpointRequest, IEnumerable<Reading>>
{
    public override void Configure()
    {
        Get("/api/reading");
        Roles("User");
    }

    public override async Task HandleAsync(GetReadingsEndpointRequest req, CancellationToken ct)
    {
        try
        {
            var meter = await meterService.GetById(req.MeterId);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");

            if (userId == -1)
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            if (meter.UserId != userId)
            {
                var sharedMeters = await meterService.GetShared(userId);

                if (!sharedMeters.Any(x => x.Id == req.MeterId))
                {
                    if (!User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin"))
                    {
                        await Send.UnauthorizedAsync(ct);
                        return;
                    }
                }
            }

            var readings = await readingService.GetByMeterId(req.MeterId);
            await Send.OkAsync(readings, ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            logger.LogError(
                ex,
                "An error occurred while getting reading for meter id {MeterId}",
                req.MeterId
            );
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
