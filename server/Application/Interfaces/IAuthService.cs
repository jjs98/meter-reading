using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<string> Login(UserLoginDto userLoginDto);
    Task<string> Refresh(User user);
}
