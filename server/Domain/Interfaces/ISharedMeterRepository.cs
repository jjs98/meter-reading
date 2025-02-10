using Domain.Models;

namespace Domain.Interfaces;

public interface ISharedMeterRepository
{
    Task<IEnumerable<SharedMeter>> GetAll();
    Task<IEnumerable<SharedMeter>> GetByUserId(int userId);
    Task<IEnumerable<SharedMeter>> GetByMeterId(int meterId);
    Task<SharedMeter> GetBy(int userId, int meterId);
    Task<SharedMeter> Create(SharedMeter meter);
    Task DeleteByUserId(int userId, int meterId);
    Task DeleteByMeterId(int meterId);
    Task Delete(int id);
}
