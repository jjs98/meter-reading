using Domain.Models;

namespace Domain.Interfaces;

public interface ISharedMeterRepository
{
    Task<IEnumerable<SharedMeter>> GetAll();
    Task<IEnumerable<SharedMeter>> GetByUserId(int userId);
    Task<SharedMeter> GetBy(int userId, int meterId);
    Task<SharedMeter> Create(SharedMeter meter);
    Task DeleteByUserId(int userId, int meterId);
    Task Delete(int id);
}
