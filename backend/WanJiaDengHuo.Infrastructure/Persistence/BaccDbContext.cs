using WanJiaDengHuo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace WanJiaDengHuo.Infrastructure.Persistence;

public class BaccDbContext(DbContextOptions<BaccDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaccDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
