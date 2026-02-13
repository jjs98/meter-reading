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

public record GetReadingsEndpointRequest(int MeterId);

public record GetReadingsEndpointResponse(int Id, int MeterId, string Number, DateTime ReadingDate);

public class GetReadingsEndpointValidator : Validator<GetReadingsEndpointRequest>
{
    public GetReadingsEndpointValidator()
    {
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
    }
}

public class GetReadingsEndpoint(
    IReadingService readingService,
    IMeterService meterService,
    ILogger<GetReadingsEndpoint> logger
) : Endpoint<GetReadingsEndpointRequest, IEnumerable<GetReadingsEndpointResponse>>
{
    public override void Configure()
    {
        Get("/reading");
        Roles("User");
        Description(d =>
            d.Produces<IEnumerable<GetReadingsEndpointResponse>>((int)HttpStatusCode.OK)
                .Produces<string>((int)HttpStatusCode.NotFound, MediaTypeNames.Text.Plain)
        );
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
            await Send.OkAsync(
                readings.Select(x => new GetReadingsEndpointResponse(
                    x.Id,
                    x.MeterId,
                    x.Number,
                    x.ReadingDate
                )),
                ct
            );
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
