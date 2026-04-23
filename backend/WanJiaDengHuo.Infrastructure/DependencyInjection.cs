using WanJiaDengHuo.Application.Common.Interfaces;
using WanJiaDengHuo.Domain.Interfaces;
using WanJiaDengHuo.Infrastructure.Persistence;
using WanJiaDengHuo.Infrastructure.Persistence.Repositories;
using WanJiaDengHuo.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace WanJiaDengHuo.Infrastructure;

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
                opts.UseInMemoryDatabase("WanJiaDengHuoDb");
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
