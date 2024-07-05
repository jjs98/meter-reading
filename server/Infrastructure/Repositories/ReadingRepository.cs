using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReadingRepository : IReadingRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public ReadingRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<Reading>> GetAll()
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Readings.AsNoTracking().ToListAsync();
    }

    public async Task<Reading> GetById(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var reading = await context.Readings.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (reading is null)
            throw new EntityNotFoundException($"Reading for id {id} not found");

        return reading;
    }

    public async Task<IEnumerable<Reading>> GetAllByMeterId(int meterId)
    {
        var context = _contextFactory.CreateDbContext();
        return await context.Readings.AsNoTracking().Where(x => x.MeterId == meterId).ToListAsync();
    }

    public async Task<Reading> Create(Reading reading)
    {
        var context = _contextFactory.CreateDbContext();
        reading.UpdateDate = null;
        reading.CreateDate = DateTime.UtcNow;
        var result = await context.Readings.AddAsync(reading);
        await context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(Reading reading)
    {
        var context = _contextFactory.CreateDbContext();
        var existingReading = await GetByIdWithTracking(reading.Id);

        await context
            .Readings.Where(x => x.Id == reading.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(r => r.MeterId, reading.MeterId)
                    .SetProperty(r => r.Number, reading.Number)
                    .SetProperty(r => r.ReadingDate, reading.ReadingDate)
                    .SetProperty(r => r.UpdateDate, DateTime.UtcNow)
            );

        context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var existingReading = await GetByIdWithTracking(id);

        context.Readings.Remove(existingReading);
        await context.SaveChangesAsync();
    }

    private async Task<Reading> GetByIdWithTracking(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var reading = await context.Readings.FindAsync(id);
        if (reading is null)
            throw new EntityNotFoundException($"Reading for id {id} not found");

        return reading;
    }
}
