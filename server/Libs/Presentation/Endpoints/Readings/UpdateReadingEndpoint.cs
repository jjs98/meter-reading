using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using Domain.Models;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Readings;

public record UpdateReadingEndpointRequest(
    [property: RouteParam] int Id,
    int MeterId,
    string Number,
    DateTime ReadingDate
);

public class UpdateReadingEndpointValidator : Validator<UpdateReadingEndpointRequest>
{
    public UpdateReadingEndpointValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is required");
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
        RuleFor(x => x.Number).NotEmpty().WithMessage("Number is required");
        RuleFor(x => x.ReadingDate).NotEmpty().WithMessage("ReadingDate is required");
    }
}

public class UpdateReadingEndpoint(
    IReadingService readingService,
    IMeterService meterService,
    ILogger<UpdateReadingEndpoint> logger
) : Endpoint<UpdateReadingEndpointRequest, EmptyResponse>
{
    public override void Configure()
    {
        Put("/api/reading/{Id}");
        Roles("User");
        Description(d =>
            d.Produces((int)HttpStatusCode.NoContent)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.NotFound, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(UpdateReadingEndpointRequest req, CancellationToken ct)
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

                if (!sharedMeters.Any(x => x.Id == meter.Id))
                {
                    if (!User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin"))
                    {
                        await Send.UnauthorizedAsync(ct);
                        return;
                    }
                }
            }
            var reading = new Reading
            {
                Id = req.Id,
                MeterId = req.MeterId,
                Number = req.Number,
                ReadingDate = req.ReadingDate,
            };
            await readingService.Update(reading);
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
                "An error occurred while updating reading by id for id {Id}",
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
