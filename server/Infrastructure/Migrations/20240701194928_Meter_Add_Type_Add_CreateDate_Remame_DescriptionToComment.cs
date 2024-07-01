using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class Meter_Add_Type_Add_CreateDate_Remame_DescriptionToComment : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(name: "Name", table: "Meters", newName: "Owner");

        migrationBuilder.RenameColumn(name: "Description", table: "Meters", newName: "Comment");

        migrationBuilder.AlterColumn<string>(
            name: "Location",
            table: "Meters",
            type: "text",
            nullable: false,
            defaultValue: "",
            oldClrType: typeof(string),
            oldType: "text",
            oldNullable: true
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "Meters",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<int>(
            name: "Type",
            table: "Meters",
            type: "integer",
            nullable: false,
            defaultValue: 0
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "CreateDate", table: "Meters");

        migrationBuilder.DropColumn(name: "Type", table: "Meters");

        migrationBuilder.RenameColumn(name: "Owner", table: "Meters", newName: "Name");

        migrationBuilder.RenameColumn(name: "Comment", table: "Meters", newName: "Description");

        migrationBuilder.AlterColumn<string>(
            name: "Location",
            table: "Meters",
            type: "text",
            nullable: true,
            oldClrType: typeof(string),
            oldType: "text"
        );
    }
}
