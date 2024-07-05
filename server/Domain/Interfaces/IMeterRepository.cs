using Domain.Models;

namespace Domain.Interfaces;

public interface IMeterRepository
{
    Task<IEnumerable<Meter>> GetAll();
    Task<Meter> GetById(int id);
    Task<IEnumerable<Meter>> GetByUserId(int userId);
    Task<Meter> GetBy(int userId, int meterId);
    Task<Meter> Create(Meter meter);
    Task Update(Meter meter);
    Task Delete(int id);
}
