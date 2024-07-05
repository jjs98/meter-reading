using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_Users_Roles_Readings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Owner", table: "Meters");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Meters",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.CreateTable(
                name: "Readings",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    MeterId = table.Column<int>(type: "integer", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    ReadingDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
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
                    table.PrimaryKey("PK_Readings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Readings_Meters_MeterId",
                        column: x => x.MeterId,
                        principalTable: "Meters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_Users", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    Name = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey(
                        "PK_Roles",
                        x => new
                        {
                            x.Id,
                            x.Name,
                            x.UserId
                        }
                    );
                    table.ForeignKey(
                        name: "FK_Roles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_Meters_UserId",
                table: "Meters",
                column: "UserId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Readings_MeterId",
                table: "Readings",
                column: "MeterId"
            );

            migrationBuilder.CreateIndex(name: "IX_Roles_UserId", table: "Roles", column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meters_Users_UserId",
                table: "Meters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Meters_Users_UserId", table: "Meters");

            migrationBuilder.DropTable(name: "Readings");

            migrationBuilder.DropTable(name: "Roles");

            migrationBuilder.DropTable(name: "Users");

            migrationBuilder.DropIndex(name: "IX_Meters_UserId", table: "Meters");

            migrationBuilder.DropColumn(name: "UserId", table: "Meters");

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "Meters",
                type: "text",
                nullable: false,
                defaultValue: ""
            );
        }
    }
}
