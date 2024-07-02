using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Services;

public class MigrationService : IHostedService
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public MigrationService(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var context = _contextFactory.CreateDbContext();
        await context.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
