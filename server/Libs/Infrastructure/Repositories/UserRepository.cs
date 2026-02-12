using Domain.Exceptions;
using Domain.Models;
using Infrastructure.Entities;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public UserRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        using var context = _contextFactory.CreateDbContext();
        var users = await context.Users.AsNoTracking().ToListAsync();
        return users.Select(x => x.ToDomainModel());
    }

    public async Task<User> GetById(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
            throw new EntityNotFoundException($"User for id {id} not found");

        return user.ToDomainModel();
    }

    public async Task<User> GetByUsername(string username)
    {
        using var context = _contextFactory.CreateDbContext();
        var user = await context
            .Users.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (user is null)
            throw new EntityNotFoundException($"User with name {username} not found");

        return user.ToDomainModel();
    }

    public async Task<User> Create(User user)
    {
        using var context = _contextFactory.CreateDbContext();
        var userEntity = UserEntity.FromDomainModel(user);
        var result = await context.Users.AddAsync(userEntity);
        await context.SaveChangesAsync();
        return result.Entity.ToDomainModel();
    }

    public async Task Update(User user)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingUser = await GetByIdWithTracking(user.Id);

        await context
            .Users.Where(x => x.Id == user.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(u => u.Username, user.Username)
                    .SetProperty(u => u.Password, user.Password)
                    .SetProperty(u => u.FirstName, user.FirstName)
                    .SetProperty(u => u.LastName, user.LastName)
                    .SetProperty(u => u.Email, user.Email)
            );

        context.ChangeTracker.Clear();
    }

    public async Task UpdatePassword(int id, string password)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingUser = await GetById(id);

        await context
            .Users.Where(x => x.Id == id)
            .ExecuteUpdateAsync(x => x.SetProperty(u => u.Password, password));

        context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingUser = await GetByIdWithTracking(id);

        context.Users.Remove(existingUser);
        await context.SaveChangesAsync();
    }

    private async Task<UserEntity> GetByIdWithTracking(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var user = await context.Users.FindAsync(id);
        if (user is null)
            throw new EntityNotFoundException($"User for id {id} not found");

        return user;
    }
}
