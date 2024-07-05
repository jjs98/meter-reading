using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class Add_UserRoles : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(name: "FK_Roles_Users_UserId", table: "Roles");

        migrationBuilder.DropPrimaryKey(name: "PK_Roles", table: "Roles");

        migrationBuilder.DropIndex(name: "IX_Roles_UserId", table: "Roles");

        migrationBuilder.DropColumn(name: "UserId", table: "Roles");

        migrationBuilder.AddPrimaryKey(name: "PK_Roles", table: "Roles", columns: ["Id", "Name"]);

        migrationBuilder.CreateTable(
            name: "UserRoles",
            columns: table => new
            {
                RoleId = table.Column<int>(type: "integer", nullable: false),
                UserId = table.Column<int>(type: "integer", nullable: false),
                Id = table
                    .Column<int>(type: "integer", nullable: false)
                    .Annotation(
                        "Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                    ),
                CreateDate = table.Column<DateTime>(
                    type: "timestamp with time zone",
                    nullable: false
                ),
                UpdateDate = table.Column<DateTime>(
                    type: "timestamp with time zone",
                    nullable: true
                )
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(
                    name: "FK_UserRoles_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade
                );
            }
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "UserRoles");

        migrationBuilder.DropPrimaryKey(name: "PK_Roles", table: "Roles");

        migrationBuilder.AddColumn<int>(
            name: "UserId",
            table: "Roles",
            type: "integer",
            nullable: false,
            defaultValue: 0
        );

        migrationBuilder.AddPrimaryKey(
            name: "PK_Roles",
            table: "Roles",
            columns: ["Id", "Name", "UserId"]
        );

        migrationBuilder.CreateIndex(name: "IX_Roles_UserId", table: "Roles", column: "UserId");

        migrationBuilder.AddForeignKey(
            name: "FK_Roles_Users_UserId",
            table: "Roles",
            column: "UserId",
            principalTable: "Users",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
        );
    }
}
