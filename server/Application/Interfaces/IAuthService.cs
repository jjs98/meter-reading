using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces;

public interface IAuthService
{
    string HashPassword(string password);
    Task<TokenDto> Login(UserLoginDto userLoginDto);
    Task<TokenDto> Refresh(User user);
}
