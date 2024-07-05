using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public RoleRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<Role>> GetAll()
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Roles.AsNoTracking().ToListAsync();
    }

    public async Task<Role> GetByName(string name)
    {
        var context = _contextFactory.CreateDbContext();
        var role = await context.Roles.AsNoTracking().FirstOrDefaultAsync(x => x.Name == name);
        if (role is null)
            throw new EntityNotFoundException($"Role with name {name} not found");

        return role;
    }

    public async Task<Role> GetById(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var role = await context.Roles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (role is null)
            throw new EntityNotFoundException($"Role with id {id} not found");

        return role;
    }

    public async Task<IEnumerable<Role>> GetByIds(IEnumerable<int> ids)
    {
        var context = _contextFactory.CreateDbContext();
        var roles = await context.Roles.AsNoTracking().Where(x => ids.Contains(x.Id)).ToListAsync();
        return roles;
    }

    public async Task<Role> Create(Role role)
    {
        var context = _contextFactory.CreateDbContext();
        role.UpdateDate = null;
        role.CreateDate = DateTime.UtcNow;
        var result = await context.Roles.AddAsync(role);
        await context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(Role role)
    {
        var context = _contextFactory.CreateDbContext();
        var existingRole = await GetByIdWithTracking(role.Id);

        await context
            .Roles.Where(x => x.Id == role.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(r => r.Name, role.Name)
                    .SetProperty(r => r.UpdateDate, DateTime.UtcNow)
            );

        context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var existingRole = await GetByIdWithTracking(id);

        context.Roles.Remove(existingRole);
        await context.SaveChangesAsync();
    }

    private async Task<Role> GetByIdWithTracking(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var role = await context.Roles.FindAsync(id);
        if (role is null)
            throw new EntityNotFoundException($"Role with id {id} not found");

        return role;
    }
}
