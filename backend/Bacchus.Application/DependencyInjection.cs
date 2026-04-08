using Bacchus.Application.Auth.Commands;
using Bacchus.Application.Cart.Commands;
using Bacchus.Application.Cart.Queries;
using Bacchus.Application.Products.Queries;
using Bacchus.Application.Wishlist.Commands;
using Bacchus.Application.Wishlist.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace Bacchus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
        return services;
    }
}
