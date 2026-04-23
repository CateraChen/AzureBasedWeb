using WanJiaDengHuo.Domain.Entities;

namespace WanJiaDengHuo.Domain.Interfaces;

public interface IWishlistRepository
{
    Task<List<WishlistItem>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<WishlistItem?> GetAsync(Guid userId, Guid productId, CancellationToken ct = default);
    Task AddAsync(WishlistItem item, CancellationToken ct = default);
    void Remove(WishlistItem item);
}
