using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WandSky.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlogCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FeaturedImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MetaDescription = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    MetaKeywords = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogPosts_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BlogComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    BlogPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ParentCommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogComments_BlogComments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "BlogComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BlogComments_BlogPosts_BlogPostId",
                        column: x => x.BlogPostId,
                        principalTable: "BlogPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogCategories_Name",
                table: "BlogCategories",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_BlogCategories_Slug",
                table: "BlogCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_BlogPostId",
                table: "BlogComments",
                column: "BlogPostId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_CreatedAt",
                table: "BlogComments",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_IsApproved",
                table: "BlogComments",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_ParentCommentId",
                table: "BlogComments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_UserId",
                table: "BlogComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_AuthorId",
                table: "BlogPosts",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_Category",
                table: "BlogPosts",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_CreatedAt",
                table: "BlogPosts",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_IsPublished",
                table: "BlogPosts",
                column: "IsPublished");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_PublishedAt",
                table: "BlogPosts",
                column: "PublishedAt");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_Slug",
                table: "BlogPosts",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogCategories");

            migrationBuilder.DropTable(
                name: "BlogComments");

            migrationBuilder.DropTable(
                name: "BlogPosts");
        }
    }
}
