using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
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
        var context = _contextFactory.CreateDbContext();
        return await context.Users.AsNoTracking().ToListAsync();
    }

    public async Task<User> GetById(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
            throw new EntityNotFoundException($"User for id {id} not found");

        return user;
    }

    public async Task<User> GetByUsername(string username)
    {
        var context = _contextFactory.CreateDbContext();
        var user = await context
            .Users.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Username == username);
        if (user is null)
            throw new EntityNotFoundException($"User with name {username} not found");

        return user;
    }

    public async Task<User> Create(User user)
    {
        var context = _contextFactory.CreateDbContext();
        user.UpdateDate = null;
        user.CreateDate = DateTime.UtcNow;
        var result = await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(User user)
    {
        var context = _contextFactory.CreateDbContext();
        var existingUser = await GetByIdWithTracking(user.Id);

        await context
            .Users.Where(x => x.Id == user.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(u => u.Username, user.Username)
                    .SetProperty(u => u.Password, user.Password)
                    .SetProperty(u => u.FirstName, user.FirstName)
                    .SetProperty(u => u.LastName, user.LastName)
                    .SetProperty(u => u.Email, user.Email)
                    .SetProperty(u => u.UpdateDate, DateTime.UtcNow)
            );

        context.ChangeTracker.Clear();
    }

    public async Task UpdatePassword(int id, string password)
    {
        var context = _contextFactory.CreateDbContext();
        var existingUser = await GetById(id);

        await context
            .Users.Where(x => x.Id == id)
            .ExecuteUpdateAsync(x => x.SetProperty(u => u.Password, password));

        context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var existingUser = await GetByIdWithTracking(id);

        context.Users.Remove(existingUser);
        await context.SaveChangesAsync();
    }

    private async Task<User> GetByIdWithTracking(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var user = await context.Users.FindAsync(id);
        if (user is null)
            throw new EntityNotFoundException($"User for id {id} not found");

        return user;
    }
}
