using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using Domain.Models;
using FastEndpoints;
using Microsoft.AspNetCore.Http;

namespace Presentation.Endpoints.Meters;

public record CreateMeterEndpointRequest(
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public record CreateMeterEndpointResponse(
    int Id,
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public class CreateMeterEndpoint(IMeterService meterService)
    : Endpoint<CreateMeterEndpointRequest, CreateMeterEndpointResponse>
{
    public override void Configure()
    {
        Post("/api/meter");
        Roles("User");
    }

    public override async Task HandleAsync(CreateMeterEndpointRequest req, CancellationToken ct)
    {
        if (
            req.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
            && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
        )
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        var meter = new Meter
        {
            UserId = req.UserId,
            Location = req.Location,
            MeterNumber = req.MeterNumber,
            Addition = req.Addition,
            Type = req.Type,
        };
        var createdMeter = await meterService.Create(meter);
        HttpContext.Response.StatusCode = StatusCodes.Status201Created;
        await Send.OkAsync(
            new CreateMeterEndpointResponse(
                createdMeter.Id,
                createdMeter.UserId,
                createdMeter.Location,
                createdMeter.MeterNumber,
                createdMeter.Addition,
                createdMeter.Type
            ),
            ct
        );
    }
}
