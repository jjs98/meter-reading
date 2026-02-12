using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record RevokeMeterEndpointRequest(int MeterId, int UserId);

public class RevokeMeterEndpointValidator : Validator<RevokeMeterEndpointRequest>
{
    public RevokeMeterEndpointValidator()
    {
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
        RuleFor(x => x.UserId).GreaterThan(0).WithMessage("UserId is required");
    }
}

public class RevokeMeterEndpoint(IMeterService meterService, ILogger<RevokeMeterEndpoint> logger)
    : Endpoint<RevokeMeterEndpointRequest, EmptyResponse>
{
    public override void Configure()
    {
        Delete("/api/meter/revoke");
        Roles("User");
        Description(d =>
            d.Produces((int)HttpStatusCode.NoContent)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.NotFound, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(RevokeMeterEndpointRequest req, CancellationToken ct)
    {
        try
        {
            var meter = await meterService.GetById(req.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
                && req.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            )
            {
                var sharedMeterToDelete = await meterService.GetSharedByMeterId(req.MeterId);
                if (!sharedMeterToDelete.Any(x => x.UserId == req.UserId))
                {
                    await Send.UnauthorizedAsync(ct);
                    return;
                }
            }

            await meterService.RevokeMeter(req.UserId, req.MeterId);
            await Send.StringAsync(string.Empty, StatusCodes.Status204NoContent, cancellation: ct);
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
                "An error occurred while revoking meter with id {Id} for user {User}",
                req.MeterId,
                req.UserId
            );
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
