using Domain.Models;

namespace Application.Interfaces;

public interface IReadingService
{
    Task<IEnumerable<Reading>> GetAll();
    Task<Reading> GetById(int id);
    Task<IEnumerable<Reading>> GetBy(int userId, int meterId);
    Task<Reading> Create(Reading reading);
    Task Update(Reading reading);
    Task Delete(int id);
}
