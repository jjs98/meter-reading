using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMeterService _meterService;

    public UserService(IUserRepository userRepository, IMeterService meterService)
    {
        _userRepository = userRepository;
        _meterService = meterService;
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
        var meters = await _meterService.GetByUserId(id);
        foreach (var meter in meters)
        {
            await _meterService.Delete(meter.Id);
        }
        await _userRepository.Delete(id);
    }
}
