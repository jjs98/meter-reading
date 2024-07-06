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

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public async Task<TokenDto> Login(UserLoginDto userLoginDto)
    {
        var user = await _userService.GetByUsername(userLoginDto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.Password))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        return await GenerateJwtToken(user);
    }

    public async Task<TokenDto> Refresh(User user)
    {
        return await GenerateJwtToken(user);
    }

    private async Task<TokenDto> GenerateJwtToken(User user)
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
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddMinutes(15),
            SigningCredentials = credentials,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new TokenDto { Token = tokenHandler.WriteToken(token), Refresh = "" };
    }
}
