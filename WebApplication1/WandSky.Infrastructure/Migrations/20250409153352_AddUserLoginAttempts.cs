using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WandSky.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserLoginAttempts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginFailedAt",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LockoutEndAt",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoginFailedCount",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginFailedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LockoutEndAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LoginFailedCount",
                table: "Users");
        }
    }
}
