using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Services;

public class MigrationService : IHostedService
{
    private readonly AppDbContext _appDbContext;

    public MigrationService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await _appDbContext.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
