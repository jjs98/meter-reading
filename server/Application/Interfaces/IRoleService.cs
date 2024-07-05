using Domain.Models;

namespace Application.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<Role>> GetAll();
    Task<Role> GetById(int id);
    Task<IEnumerable<Role>> GetByIds(IEnumerable<int> ids);
    Task<Role> GetByName(string name);
    Task<Role> Create(Role role);
    Task Update(Role role);
    Task Delete(int id);
}
