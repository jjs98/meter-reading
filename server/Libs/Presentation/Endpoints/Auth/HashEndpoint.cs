using Application.Services;
using FastEndpoints;
using FluentValidation;

namespace Presentation.Endpoints.Auth;

public record HashEndpointRequest(string Password);

public record HashEndpointResponse(string HashedPassword);

public class HashEndpointValidator : Validator<HashEndpointRequest>
{
    public HashEndpointValidator()
    {
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
    }
}

public class HashEndpoint(IAuthService authService)
    : Endpoint<HashEndpointRequest, HashEndpointResponse>
{
    public override void Configure()
    {
        Post("/api/auth/hash");
        AllowAnonymous();
    }

    public override async Task HandleAsync(HashEndpointRequest req, CancellationToken ct)
    {
        var hashedPassword = authService.HashPassword(req.Password);
        var result = new HashEndpointResponse(hashedPassword);
        await Send.OkAsync(result, ct);
    }
}
