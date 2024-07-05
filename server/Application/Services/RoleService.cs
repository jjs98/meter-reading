using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models;

namespace Application.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;

    public RoleService(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task<IEnumerable<Role>> GetAll()
    {
        return await _roleRepository.GetAll();
    }

    public async Task<Role> GetById(int id)
    {
        return await _roleRepository.GetById(id);
    }

    public async Task<IEnumerable<Role>> GetByIds(IEnumerable<int> ids)
    {
        return await _roleRepository.GetByIds(ids);
    }

    public async Task<Role> GetByName(string name)
    {
        return await _roleRepository.GetByName(name);
    }

    public async Task<Role> Create(Role role)
    {
        return await _roleRepository.Create(role);
    }

    public async Task Update(Role role)
    {
        await _roleRepository.Update(role);
    }

    public Task Delete(int id)
    {
        return _roleRepository.Delete(id);
    }
}
