using Bacchus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bacchus.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).HasMaxLength(300).IsRequired();
        builder.Property(p => p.WineType).HasMaxLength(50).IsRequired();
        builder.Property(p => p.Varietal).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Region).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Winery).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Volume).HasMaxLength(20);
        builder.Property(p => p.ImageUrl).HasMaxLength(500);
        builder.Property(p => p.AvailabilityStatus).HasMaxLength(30);
        builder.Property(p => p.RatingScore).HasPrecision(5, 2);
        builder.Property(p => p.Deals)
            .HasConversion(
                v => string.Join("|", v),
                v => v.Length == 0 ? new List<string>() : new List<string>(v.Split('|', StringSplitOptions.RemoveEmptyEntries)));

        builder.HasIndex(p => p.WineType);
        builder.HasIndex(p => p.Varietal);
        builder.HasIndex(p => p.Region);
        builder.HasIndex(p => p.Winery);
        builder.HasIndex(p => p.Vintage);
    }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).HasMaxLength(256).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PasswordHash).HasMaxLength(500).IsRequired();
        builder.Property(u => u.FirstName).HasMaxLength(100);
        builder.Property(u => u.LastName).HasMaxLength(100);
        builder.Property(u => u.Role).HasMaxLength(30);
        builder.Property(u => u.RefreshToken).HasMaxLength(500);
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.SessionId).HasMaxLength(100);
        builder.HasOne(c => c.Product).WithMany(p => p.CartItems).HasForeignKey(c => c.ProductId);
        builder.HasOne(c => c.User).WithMany(u => u.CartItems).HasForeignKey(c => c.UserId).IsRequired(false);
        builder.HasIndex(c => new { c.UserId, c.ProductId });
        builder.HasIndex(c => new { c.SessionId, c.ProductId });
    }
}

public class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.HasKey(w => w.Id);
        builder.HasIndex(w => new { w.UserId, w.ProductId }).IsUnique();
        builder.HasOne(w => w.Product).WithMany(p => p.WishlistItems).HasForeignKey(w => w.ProductId);
        builder.HasOne(w => w.User).WithMany(u => u.WishlistItems).HasForeignKey(w => w.UserId);
    }
}
