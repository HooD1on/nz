using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WandSky.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWishlistEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Wishlists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DestinationId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DestinationTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DestinationImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DestinationLocation = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DestinationPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DestinationRating = table.Column<double>(type: "float", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wishlists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wishlist_User_Destination",
                table: "Wishlists",
                columns: new[] { "UserId", "DestinationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wishlist_UserId",
                table: "Wishlists",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Wishlists");
        }
    }
}
