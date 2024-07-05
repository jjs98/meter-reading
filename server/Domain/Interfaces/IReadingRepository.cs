using Domain.Models;

namespace Domain.Interfaces;

public interface IReadingRepository
{
    Task<IEnumerable<Reading>> GetAll();
    Task<Reading> GetById(int id);
    Task<IEnumerable<Reading>> GetAllByMeterId(int meterId);
    Task<Reading> Create(Reading reading);
    Task Update(Reading reading);
    Task Delete(int id);
}
