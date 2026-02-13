using System.Net;
using System.Net.Mime;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Readings;

public record DeleteReadingEndpointRequest([property: RouteParam] int Id);

public class DeleteReadingEndpointValidator : Validator<DeleteReadingEndpointRequest>
{
    public DeleteReadingEndpointValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is required");
    }
}

public class DeleteReadingEndpoint(
    IReadingService readingService,
    IMeterService meterService,
    ILogger<DeleteReadingEndpoint> logger
) : Endpoint<DeleteReadingEndpointRequest, EmptyResponse>
{
    public override void Configure()
    {
        Delete("/reading/{Id}");
        Roles("User");
        Description(d =>
            d.Produces((int)HttpStatusCode.NoContent)
                .Produces<string>((int)HttpStatusCode.NotFound, MediaTypeNames.Text.Plain)
        );
    }

    public override async Task HandleAsync(DeleteReadingEndpointRequest req, CancellationToken ct)
    {
        try
        {
            var reading = await readingService.GetById(req.Id);
            var meter = await meterService.GetById(reading.MeterId);
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");

            if (userId == -1)
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            if (meter.UserId != userId)
            {
                var sharedMeters = await meterService.GetShared(userId);

                if (!sharedMeters.Any(x => x.Id == meter.Id))
                {
                    if (!User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin"))
                    {
                        await Send.UnauthorizedAsync(ct);
                        return;
                    }
                }
            }

            await readingService.Delete(req.Id);
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
                "An error occurred while deleting reading by id for id {Id}",
                req.Id
            );
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
