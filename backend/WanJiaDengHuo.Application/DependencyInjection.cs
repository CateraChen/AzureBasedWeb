using WanJiaDengHuo.Application.Auth.Commands;
using WanJiaDengHuo.Application.Cart.Commands;
using WanJiaDengHuo.Application.Cart.Queries;
using WanJiaDengHuo.Application.Products.Queries;
using WanJiaDengHuo.Application.Wishlist.Commands;
using WanJiaDengHuo.Application.Wishlist.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace WanJiaDengHuo.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
        return services;
    }
}
