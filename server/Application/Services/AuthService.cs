using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IUserService _userService;
    private readonly IRoleService _roleService;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRoleRepository userRoleRepository,
        IUserService userService,
        IRoleService roleService,
        IConfiguration configuration
    )
    {
        _userRoleRepository = userRoleRepository;
        _userService = userService;
        _roleService = roleService;
        _configuration = configuration;
    }

    public async Task<string> Login(UserLoginDto userLoginDto)
    {
        var user = await _userService.GetByUsername(userLoginDto.Username);
        if (user == null || userLoginDto.Password != user.Password)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        return await GenerateJwtToken(user);
    }

    public async Task<string> Refresh(User user)
    {
        return await GenerateJwtToken(user);
    }

    private async Task<string> GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
            throw new Exception("Jwt:Key is missing in Server");

        var key = Encoding.UTF8.GetBytes(jwtKey);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.GivenName, user.FirstName ?? string.Empty),
            new(ClaimTypes.Surname, user.LastName ?? string.Empty)
        };

        var userRoles = await _userRoleRepository.GetByUserId(user.Id);
        var roles = await _roleService.GetByIds(userRoles.Select(x => x.RoleId));
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature
        );
        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials
        );
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }
}
