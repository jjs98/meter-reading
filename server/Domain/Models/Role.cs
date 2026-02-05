namespace Domain.Models;

public class Role : DbEntity
{
    public required string Name { get; set; }
    public IEnumerable<UserRole>? UserRoles { get; set; }
}
