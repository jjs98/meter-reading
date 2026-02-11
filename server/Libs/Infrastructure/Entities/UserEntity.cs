using Domain.Models;

namespace Infrastructure.Entities;

public class UserEntity
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public IEnumerable<UserRoleEntity>? UserRoles { get; set; }
    public IEnumerable<MeterEntity>? Meters { get; set; }
    public IEnumerable<SharedMeterEntity>? SharedMeters { get; set; }

    public string GetName()
    {
        if (string.IsNullOrWhiteSpace(FirstName) && string.IsNullOrWhiteSpace(LastName))
            return Username;

        return $"{FirstName} {LastName}";
    }

    public User ToDomainModel()
    {
        return new User
        {
            Id = Id,
            Username = Username,
            Password = Password,
            FirstName = FirstName,
            LastName = LastName,
            Email = Email,
            UserRoles = UserRoles?.Select(ur => ur.ToDomainModel()).ToList(),
            Meters = Meters?.Select(m => m.ToDomainModel()).ToList(),
            SharedMeters = SharedMeters?.Select(sm => sm.ToDomainModel()).ToList(),
        };
    }

    public static UserEntity FromDomainModel(User user)
    {
        return new UserEntity
        {
            Id = user.Id,
            Username = user.Username,
            Password = user.Password,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            UserRoles = user.UserRoles?.Select(ur => UserRoleEntity.FromDomainModel(ur)).ToList(),
            Meters = user.Meters?.Select(m => MeterEntity.FromDomainModel(m)).ToList(),
            SharedMeters = user
                .SharedMeters?.Select(sm => SharedMeterEntity.FromDomainModel(sm))
                .ToList(),
        };
    }
}
