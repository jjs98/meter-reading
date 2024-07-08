using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MeterRepository : IMeterRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public MeterRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<Meter>> GetAll()
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Meters.AsNoTracking().ToListAsync();
    }

    public async Task<Meter> GetById(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter;
    }

    public async Task<IEnumerable<Meter>> GetByUserId(int userId)
    {
        var context = _contextFactory.CreateDbContext();
        var meter = await context
            .Meters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return meter;
    }

    public async Task<Meter> GetBy(int userId, int meterId)
    {
        var context = _contextFactory.CreateDbContext();
        var meter = await context
            .Meters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .FirstOrDefaultAsync(x => x.Id == meterId);
        if (meter is null)
            throw new EntityNotFoundException(
                $"Meter for user id {userId} and meter id {meterId} not found"
            );

        return meter;
    }

    public async Task<Meter> Create(Meter meter)
    {
        var context = _contextFactory.CreateDbContext();
        meter.UpdateDate = null;
        meter.CreateDate = DateTime.UtcNow;
        var result = await context.Meters.AddAsync(meter);
        await context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(Meter meter)
    {
        var context = _contextFactory.CreateDbContext();
        var existingMeter = await GetByIdWithTracking(meter.Id);

        await context
            .Meters.Where(x => x.Id == meter.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(m => m.Location, meter.Location)
                    .SetProperty(m => m.Type, meter.Type)
                    .SetProperty(m => m.MeterNumber, meter.MeterNumber)
                    .SetProperty(m => m.Comment, meter.Comment)
                    .SetProperty(m => m.UpdateDate, DateTime.UtcNow)
            );

        context.ChangeTracker.Clear();
    }

    public async Task DeleteByUserId(int userId)
    {
        var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.Where(x => x.UserId == userId).ToArrayAsync();

        context.Meters.RemoveRange(meter);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var existingMeter = await GetByIdWithTracking(id);

        context.Meters.Remove(existingMeter);
        await context.SaveChangesAsync();
    }

    private async Task<Meter> GetByIdWithTracking(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.FindAsync(id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter;
    }
}
