namespace Domain.Models;

public class User : DbEntity
{
    public required string Name { get; set; }
    public required string Password { get; set; }
    public IEnumerable<Role>? Roles { get; set; }
    public IEnumerable<Meter>? Meters { get; set; }
}
