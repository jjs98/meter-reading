using Domain.Models;

namespace Domain.Interfaces;

public interface IMeterRepository
{
    Task<IEnumerable<Meter>> GetAll();
    Task<Meter> GetById(int id);
    Task<Meter> Create(Meter meter);
    Task Update(Meter meter);
    Task Delete(int id);
}
