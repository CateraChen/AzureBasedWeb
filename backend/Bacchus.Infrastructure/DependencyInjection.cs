using Bacchus.Application.Common.Interfaces;
using Bacchus.Domain.Interfaces;
using Bacchus.Infrastructure.Persistence;
using Bacchus.Infrastructure.Persistence.Repositories;
using Bacchus.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Bacchus.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration config)
    {
        var databaseProvider = config["Database:Provider"];
        var connectionString = config.GetConnectionString("DefaultConnection");

        services.AddDbContext<BaccDbContext>(opts =>
        {
            if (string.Equals(databaseProvider, "InMemory", StringComparison.OrdinalIgnoreCase))
            {
                opts.UseInMemoryDatabase("BacchusDb");
                return;
            }

            opts.UseSqlServer(connectionString);
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICartRepository, CartRepository>();
        services.AddScoped<IWishlistRepository, WishlistRepository>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
