using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using Domain.Models;
using FastEndpoints;
using FluentValidation;
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

public class CreateMeterEndpointValidator : Validator<CreateMeterEndpointRequest>
{
    public CreateMeterEndpointValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0).WithMessage("UserId is required");
        RuleFor(x => x.Location).NotEmpty().WithMessage("Location is required");
    }
}

public class CreateMeterEndpoint(IMeterService meterService)
    : Endpoint<CreateMeterEndpointRequest, CreateMeterEndpointResponse>
{
    public override void Configure()
    {
        Post("/meter");
        Roles("User");
        Description(d => d.Produces<CreateMeterEndpointResponse>((int)HttpStatusCode.Created));
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
        await Send.CreatedAtAsync<CreateMeterEndpoint>(
            responseBody: new CreateMeterEndpointResponse(
                createdMeter.Id,
                createdMeter.UserId,
                createdMeter.Location,
                createdMeter.MeterNumber,
                createdMeter.Addition,
                createdMeter.Type
            ),
            cancellation: ct
        );
    }
}
