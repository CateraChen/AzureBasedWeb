using WanJiaDengHuo.Domain.Common;

namespace WanJiaDengHuo.Domain.Entities;

public class CartItem : BaseEntity
{
    public Guid? UserId { get; private set; }
    public string? SessionId { get; private set; }   // guest cart key
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }         // cases

    public User? User { get; private set; }
    public Product Product { get; private set; } = null!;

    protected CartItem() { }

    public static CartItem ForUser(Guid userId, Guid productId, int quantity) =>
        new() { UserId = userId, ProductId = productId, Quantity = quantity };

    public static CartItem ForGuest(string sessionId, Guid productId, int quantity) =>
        new() { SessionId = sessionId, ProductId = productId, Quantity = quantity };

    public void UpdateQuantity(int quantity)
    {
        Quantity = quantity;
        SetUpdated();
    }
}
