using Bacchus.Domain.Entities;
using Bacchus.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Bacchus.Infrastructure.Persistence.Repositories;

public class UserRepository(BaccDbContext db) : IUserRepository
{
    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        db.Users.FindAsync([id], ct).AsTask();

    public async Task AddAsync(User user, CancellationToken ct = default) =>
        await db.Users.AddAsync(user, ct);

    public void Update(User user) => db.Users.Update(user);

    public Task<bool> ExistsAsync(string email, CancellationToken ct = default) =>
        db.Users.AnyAsync(u => u.Email == email.ToLowerInvariant(), ct);
}

public class CartRepository(BaccDbContext db) : ICartRepository
{
    public Task<List<CartItem>> GetByUserAsync(Guid userId, CancellationToken ct = default) =>
        db.CartItems.Include(c => c.Product).Where(c => c.UserId == userId).ToListAsync(ct);

    public Task<List<CartItem>> GetBySessionAsync(string sessionId, CancellationToken ct = default) =>
        db.CartItems.Include(c => c.Product).Where(c => c.SessionId == sessionId).ToListAsync(ct);

    public Task<CartItem?> GetItemAsync(Guid? userId, string? sessionId, Guid productId, CancellationToken ct = default) =>
        userId.HasValue
            ? db.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId, ct)
            : db.CartItems.FirstOrDefaultAsync(c => c.SessionId == sessionId && c.ProductId == productId, ct);

    public async Task AddAsync(CartItem item, CancellationToken ct = default) =>
        await db.CartItems.AddAsync(item, ct);

    public void Update(CartItem item) => db.CartItems.Update(item);

    public void Remove(CartItem item) => db.CartItems.Remove(item);

    public Task ClearByUserAsync(Guid userId, CancellationToken ct = default) =>
        db.CartItems.Where(c => c.UserId == userId).ExecuteDeleteAsync(ct);

    public async Task MergeGuestToUserAsync(string sessionId, Guid userId, CancellationToken ct = default)
    {
        var guestItems = await db.CartItems
            .Where(c => c.SessionId == sessionId)
            .ToListAsync(ct);

        foreach (var guest in guestItems)
        {
            var existing = await db.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == guest.ProductId, ct);

            if (existing is not null)
                existing.UpdateQuantity(existing.Quantity + guest.Quantity);
            else
                await db.CartItems.AddAsync(CartItem.ForUser(userId, guest.ProductId, guest.Quantity), ct);

            db.CartItems.Remove(guest);
        }
    }
}

public class WishlistRepository(BaccDbContext db) : IWishlistRepository
{
    public Task<List<WishlistItem>> GetByUserAsync(Guid userId, CancellationToken ct = default) =>
        db.WishlistItems.Include(w => w.Product).Where(w => w.UserId == userId).ToListAsync(ct);

    public Task<WishlistItem?> GetAsync(Guid userId, Guid productId, CancellationToken ct = default) =>
        db.WishlistItems.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId, ct);

    public async Task AddAsync(WishlistItem item, CancellationToken ct = default) =>
        await db.WishlistItems.AddAsync(item, ct);

    public void Remove(WishlistItem item) => db.WishlistItems.Remove(item);
}
