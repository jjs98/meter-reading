using Domain.Models;

namespace Domain.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAll();
    Task<User> GetById(int id);
    Task<User> GetByUsername(string name);
    Task<User> Create(User user);
    Task Update(User user);
    Task Delete(int id);
}
