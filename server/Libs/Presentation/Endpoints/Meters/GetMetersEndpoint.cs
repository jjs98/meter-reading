using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using FastEndpoints;

namespace Presentation.Endpoints.Meters;

public record GetMeterEndpointResponse(
    int Id,
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public class GetMetersEndpoint(IMeterService meterService)
    : Endpoint<EmptyRequest, IEnumerable<GetMeterEndpointResponse>>
{
    public override void Configure()
    {
        Get("/api/meter");
        Roles("User");
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
        if (userId == -1)
        {
            await Send.UnauthorizedAsync(ct);
            return;
        }

        var meters = await meterService.GetByUserId(userId);
        var response = meters.Select(m => new GetMeterEndpointResponse(
            m.Id,
            m.UserId,
            m.Location,
            m.MeterNumber,
            m.Addition,
            m.Type
        ));
        await Send.OkAsync(response, ct);
    }
}
