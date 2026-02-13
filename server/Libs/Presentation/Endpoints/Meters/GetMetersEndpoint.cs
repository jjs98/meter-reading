using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Enums;
using FastEndpoints;
using Microsoft.AspNetCore.Http;

namespace Presentation.Endpoints.Meters;

public record GetMetersEndpointResponse(
    int Id,
    int UserId,
    string Location,
    string? MeterNumber,
    string? Addition,
    MeterType Type
);

public class GetMetersEndpoint(IMeterService meterService)
    : Endpoint<EmptyRequest, IEnumerable<GetMetersEndpointResponse>>
{
    public override void Configure()
    {
        Get("/meter");
        Roles("User");
        Description(d =>
            d.Produces<IEnumerable<GetMetersEndpointResponse>>((int)HttpStatusCode.OK)
        );
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
        var response = meters.Select(m => new GetMetersEndpointResponse(
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
