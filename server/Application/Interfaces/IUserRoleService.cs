using Domain.Models;

namespace Application.Interfaces;

public interface IUserRoleService
{
    Task<IEnumerable<UserRole>> GetByRoleId(int roleId);
    Task<IEnumerable<UserRole>> GetByUserId(int userId);
    Task<UserRole> Create(UserRole userRole);
    Task Update(UserRole userRole);
    Task Delete(int id);
}
