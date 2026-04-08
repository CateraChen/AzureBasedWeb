using Bacchus.Domain.Entities;

namespace Bacchus.Domain.Interfaces;

public interface ICartRepository
{
    Task<List<CartItem>> GetByUserAsync(Guid userId, CancellationToken ct = default);
    Task<List<CartItem>> GetBySessionAsync(string sessionId, CancellationToken ct = default);
    Task<CartItem?> GetItemAsync(Guid? userId, string? sessionId, Guid productId, CancellationToken ct = default);
    Task AddAsync(CartItem item, CancellationToken ct = default);
    void Update(CartItem item);
    void Remove(CartItem item);
    Task ClearByUserAsync(Guid userId, CancellationToken ct = default);
    Task MergeGuestToUserAsync(string sessionId, Guid userId, CancellationToken ct = default);
}
