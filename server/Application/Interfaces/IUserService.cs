using Domain.Models;

namespace Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetAll();
    Task<User> GetById(int id);
    Task<User> GetByUsername(string username);
    Task<User> Create(User user);
    Task Update(User user);
    Task Delete(int id);
}
