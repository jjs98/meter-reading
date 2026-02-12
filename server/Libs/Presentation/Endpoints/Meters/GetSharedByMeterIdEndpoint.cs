using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record GetSharedByMeterIdEndpointRequest([property: RouteParam] int MeterId);

public record GetSharedByMeterIdEndpointResponse(int MeterId, int UserId, string Username);

public class GetSharedByMeterIdEndpointValidator : Validator<GetSharedByMeterIdEndpointRequest>
{
    public GetSharedByMeterIdEndpointValidator()
    {
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
    }
}

public class GetSharedByMeterIdEndpoint(
    IMeterService meterService,
    IUserService userService,
    ILogger<GetSharedByMeterIdEndpoint> logger
) : Endpoint<GetSharedByMeterIdEndpointRequest, IEnumerable<GetSharedByMeterIdEndpointResponse>>
{
    public override void Configure()
    {
        Get("/api/meter/shared/{MeterId}");
        Roles("User");
        Description(d =>
            d.Produces<IEnumerable<GetSharedByMeterIdEndpointResponse>>((int)HttpStatusCode.OK)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.NotFound, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(
        GetSharedByMeterIdEndpointRequest req,
        CancellationToken ct
    )
    {
        try
        {
            var meter = await meterService.GetById(req.MeterId);

            if (
                meter.UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1")
                && !User.FindAll(ClaimTypes.Role).Any(x => x?.Value == "Admin")
            )
            {
                await Send.UnauthorizedAsync(ct);
                return;
            }

            var meterShareDtoList = new List<GetSharedByMeterIdEndpointResponse>();
            var sharedMeters = await meterService.GetSharedByMeterId(req.MeterId);

            foreach (var sharedMeter in sharedMeters)
            {
                var user = await userService.GetById(sharedMeter.UserId);
                meterShareDtoList.Add(
                    new GetSharedByMeterIdEndpointResponse(
                        sharedMeter.MeterId,
                        sharedMeter.UserId,
                        user.Username
                    )
                );
            }

            await Send.OkAsync(meterShareDtoList, ct);
        }
        catch (Exception ex)
        {
            if (ex is EntityNotFoundException)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            logger.LogError(ex, "An error occurred while getting meter share");
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
