using System.Net;
using System.Security.Claims;
using Application.Services;
using Domain.Exceptions;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Presentation.Endpoints.Meters;

public record ShareMeterEndpointRequest(int MeterId, int UserId, string Username);

public record ShareMeterEndpointResponse(int MeterId, int UserId, string Username);

public class ShareMeterEndpointValidator : Validator<ShareMeterEndpointRequest>
{
    public ShareMeterEndpointValidator()
    {
        RuleFor(x => x.MeterId).GreaterThan(0).WithMessage("MeterId is required");
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");
    }
}

public class ShareMeterEndpoint(
    IMeterService meterService,
    IUserService userService,
    ILogger<ShareMeterEndpoint> logger
) : Endpoint<ShareMeterEndpointRequest, ShareMeterEndpointResponse>
{
    public override void Configure()
    {
        Post("/api/meter/share");
        Roles("User");
        Description(d =>
            d.Produces<ShareMeterEndpointResponse>((int)HttpStatusCode.OK)
                .Produces((int)HttpStatusCode.Unauthorized, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.NotFound, typeof(string), "text/plain")
                .Produces((int)HttpStatusCode.InternalServerError, typeof(string), "text/plain")
        );
    }

    public override async Task HandleAsync(ShareMeterEndpointRequest req, CancellationToken ct)
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

            var user = await userService.GetByUsername(req.Username);
            if (user == null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            var createdSharedMeter = await meterService.ShareMeter(user.Id, req.MeterId);
            await Send.OkAsync(
                new ShareMeterEndpointResponse(
                    createdSharedMeter.MeterId,
                    createdSharedMeter.UserId,
                    user.Username
                ),
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
                "An error occurred while sharing meter with id {Id} for user {User}",
                req.MeterId,
                req.Username
            );
            await Send.StringAsync(
                string.Empty,
                StatusCodes.Status500InternalServerError,
                cancellation: ct
            );
        }
    }
}
