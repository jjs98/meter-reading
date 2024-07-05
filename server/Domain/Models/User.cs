namespace Domain.Models;

public class User : DbEntity
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public IEnumerable<UserRole>? Roles { get; set; }
    public IEnumerable<Meter>? Meters { get; set; }
}
