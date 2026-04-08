using Bacchus.Domain.Common;

namespace Bacchus.Domain.Entities;

public class WishlistItem : BaseEntity
{
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }

    public User User { get; private set; } = null!;
    public Product Product { get; private set; } = null!;

    protected WishlistItem() { }

    public static WishlistItem Create(Guid userId, Guid productId) =>
        new() { UserId = userId, ProductId = productId };
}
