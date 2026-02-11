using Domain.Models;

namespace Domain.Interfaces;

public interface IUserRoleRepository
{
    Task<IEnumerable<UserRole>> GetByUserId(int userId);
    Task<IEnumerable<UserRole>> GetByRoleId(int roleId);
    Task<UserRole> Create(UserRole userRole);
    Task Delete(UserRole userRole);
}
