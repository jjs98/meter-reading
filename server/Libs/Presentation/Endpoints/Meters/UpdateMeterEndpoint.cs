using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record UpdateMeterEndpointRequest(
    [property: RouteParam] int Id,
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public class UpdateMeterEndpoint(IMeterService meterService, ILogger<UpdateMeterEndpoint> logger)
    : Endpoint<UpdateMeterEndpointRequest, EmptyResponse>
{
    public override void Configure()
    {
        Put("/api/meter/{Id}");
        Roles("User");
    }

    public override async Task HandleAsync(UpdateMeterEndpointRequest req, CancellationToken ct)
    {
        if (
            req.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        try
        {
            var meter = new Meter
            {
                Id = req.Id,
                UserId = req.UserId,
                Location = req.Location,
                MeterNumber = req.MeterNumber,
                Addition = req.Addition,
                Type = req.Type,
            };
            await meterService.Update(meter);
            await Send.StringAsync(string.Empty, StatusCodes.Status204NoContent, cancellation: ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            var meterId = Sanitize(req.Id);
            logger.LogError(
                ex,
                "An error occurred while updating meter by id for id {MeterId}",
                meterId
            );
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }

        static string Sanitize(int id)
        {
            return id.ToString();
        }
    }
}
