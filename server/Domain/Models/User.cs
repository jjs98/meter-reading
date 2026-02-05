namespace Domain.Models;

public class User : DbEntity
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public IEnumerable<UserRole>? UserRoles { get; set; }
    public IEnumerable<Meter>? Meters { get; set; }
    public IEnumerable<SharedMeter>? SharedMeters { get; set; }

    public string GetName()
    {
        if (string.IsNullOrWhiteSpace(FirstName) && string.IsNullOrWhiteSpace(LastName))
            return Username;

        return $"{FirstName} {LastName}";
    }
}
