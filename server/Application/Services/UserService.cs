using Application.Interfaces;
using Domain.Interfaces;
using Domain.Models;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        return await _userRepository.GetAll();
    }

    public async Task<User> GetById(int id)
    {
        return await _userRepository.GetById(id);
    }

    public async Task<User> GetByUsername(string username)
    {
        return await _userRepository.GetByUsername(username);
    }

    public async Task<User> Create(User user)
    {
        return await _userRepository.Create(user);
    }

    public async Task Update(User user)
    {
        await _userRepository.Update(user);
    }

    public async Task Delete(int id)
    {
        await _userRepository.Delete(id);
    }
}
