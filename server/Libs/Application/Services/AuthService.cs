using System.Security.Claims;
using Domain.Interfaces;
using Domain.Models;
using FastEndpoints.Security;
using InterfaceGenerator;
using Microsoft.Extensions.Configuration;

namespace Application.Services;

[GenerateAutoInterface]
public class AuthService : IAuthService
{
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IRoleService _roleService;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRoleRepository userRoleRepository,
        IUserRepository userRepository,
        IRoleService roleService,
        IConfiguration configuration
    )
    {
        _userRoleRepository = userRoleRepository;
        _userRepository = userRepository;
        _roleService = roleService;
        _configuration = configuration;
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public async Task<AuthToken> Login(LoginRequest loginRequest)
    {
        var user = await _userRepository.GetByUsername(loginRequest.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        return await GenerateJwtToken(user);
    }

    public async Task<AuthToken> Refresh(User user)
    {
        return await GenerateJwtToken(user);
    }

    private async Task<AuthToken> GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.GivenName, user.FirstName ?? string.Empty),
            new(ClaimTypes.Surname, user.LastName ?? string.Empty),
        };

        var userRoles = await _userRoleRepository.GetByUserId(user.Id);
        var roles = await _roleService.GetByIds(userRoles.Select(x => x.RoleId));
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));

        var jwtToken = JwtBearer.CreateToken(o =>
        {
            o.SigningKey =
                _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key not found.");
            o.ExpireAt = DateTime.Now.AddMinutes(15);
            o.Issuer = _configuration["Jwt:Issuer"];
            o.Audience = _configuration["Jwt:Audience"];
            o.User.Roles.AddRange(roles.Select(r => r.Name));
            o.User.Claims.AddRange(claims);
        });

        return new AuthToken(jwtToken, "");
    }
}
