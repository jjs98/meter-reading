using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Models;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Readings;

public record CreateReadingEndpointRequest(int MeterId, string Number, DateTime ReadingDate);

public record CreateReadingEndpointResponse(
    int Id,
    int MeterId,
    string Number,
    DateTime ReadingDate
);

public class CreateReadingEndpointValidator : Validator<CreateReadingEndpointRequest>
{
    public CreateReadingEndpointValidator()
    {
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
        RuleFor(x => x.Number).NotEmpty().WithMessage("Number is required");
        RuleFor(x => x.ReadingDate).NotEmpty().WithMessage("ReadingDate is required");
    }
}

public class CreateReadingEndpoint(
    IReadingService readingService,
    IMeterService meterService,
    ILogger<CreateReadingEndpoint> logger
) : Endpoint<CreateReadingEndpointRequest, CreateReadingEndpointResponse>
{
    public override void Configure()
    {
        Post("/api/reading");
        Roles("User");
        Description(d =>
            d.Produces<CreateReadingEndpointResponse>((int)HttpStatusCode.Created)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(CreateReadingEndpointRequest req, CancellationToken ct)
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
                MeterId = req.MeterId,
                Number = req.Number,
                ReadingDate = req.ReadingDate,
            };
            var createdReading = await readingService.Create(reading);
            await Send.CreatedAtAsync<CreateReadingEndpoint>(
                responseBody: new CreateReadingEndpointResponse(
                    createdReading.Id,
                    createdReading.MeterId,
                    createdReading.Number,
                    createdReading.ReadingDate
                ),
                cancellation: ct
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while creating reading");
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
