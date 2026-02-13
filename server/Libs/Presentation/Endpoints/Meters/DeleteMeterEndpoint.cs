using System.Net;
using System.Net.Mime;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record DeleteMeterEndpointRequest([property: RouteParam] int Id);

public class DeleteMeterEndpointValidator : Validator<DeleteMeterEndpointRequest>
{
    public DeleteMeterEndpointValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is required");
    }
}

public class DeleteMeterEndpoint(IMeterService meterService, ILogger<DeleteMeterEndpoint> logger)
    : Endpoint<DeleteMeterEndpointRequest, EmptyResponse>
{
    public override void Configure()
    {
        Delete("/meter/{Id}");
        Roles("User");
        Description(d =>
            d.Produces((int)HttpStatusCode.NoContent)
                .Produces<string>((int)HttpStatusCode.NotFound, MediaTypeNames.Text.Plain)
        );
    }

    public override async Task HandleAsync(DeleteMeterEndpointRequest req, CancellationToken ct)
    {
        try
        {
            var meter = await meterService.GetById(req.Id);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            await meterService.Delete(req.Id);
            await Send.StringAsync(string.Empty, StatusCodes.Status204NoContent, cancellation: ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            logger.LogError(ex, "An error occurred while deleting meter by id for id {Id}", req.Id);
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
