using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=WandSkyDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=true");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}