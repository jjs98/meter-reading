using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class UserRoleService : IUserRoleService
{
    private readonly IUserRoleRepository _userRoleRepository;

    public UserRoleService(IUserRoleRepository userRoleRepository)
    {
        _userRoleRepository = userRoleRepository;
    }

    public Task<IEnumerable<UserRole>> GetByUserId(int userId)
    {
        return _userRoleRepository.GetByUserId(userId);
    }

    public Task<IEnumerable<UserRole>> GetByRoleId(int roleId)
    {
        return _userRoleRepository.GetByRoleId(roleId);
    }

    public async Task<UserRole> Create(UserRole userRole)
    {
        return await _userRoleRepository.Create(userRole);
    }

    public async Task Delete(UserRole userRole)
    {
        await _userRoleRepository.Delete(userRole);
    }
}
