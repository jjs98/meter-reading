namespace Domain.Models;

public class Role : DbEntity
{
    public required string Name { get; set; }
    public required int UserId { get; set; }
}
