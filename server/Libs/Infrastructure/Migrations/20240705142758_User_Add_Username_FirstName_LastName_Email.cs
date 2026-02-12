using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class User_Add_Username_FirstName_LastName_Email : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(name: "Name", table: "Users", newName: "Username");

        migrationBuilder.AddColumn<string>(
            name: "Email",
            table: "Users",
            type: "text",
            nullable: true
        );

        migrationBuilder.AddColumn<string>(
            name: "FirstName",
            table: "Users",
            type: "text",
            nullable: true
        );

        migrationBuilder.AddColumn<string>(
            name: "LastName",
            table: "Users",
            type: "text",
            nullable: true
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "Email", table: "Users");

        migrationBuilder.DropColumn(name: "FirstName", table: "Users");

        migrationBuilder.DropColumn(name: "LastName", table: "Users");

        migrationBuilder.RenameColumn(name: "Username", table: "Users", newName: "Name");
    }
}
