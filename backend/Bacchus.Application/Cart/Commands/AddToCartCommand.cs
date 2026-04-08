using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Entities;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Cart.Commands;

public record AddToCartCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId,
    int Quantity) : IRequest<CartDto>;

public class AddToCartCommandHandler(
    ICartRepository cartRepo,
    IProductRepository productRepo,
    IUnitOfWork uow)
    : IRequestHandler<AddToCartCommand, CartDto>
{
    public async Task<CartDto> Handle(AddToCartCommand cmd, CancellationToken ct)
    {
        var product = await productRepo.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new KeyNotFoundException("Product not found.");

        var existing = await cartRepo.GetItemAsync(cmd.UserId, cmd.SessionId, cmd.ProductId, ct);
        if (existing is not null)
        {
            existing.UpdateQuantity(existing.Quantity + cmd.Quantity);
            cartRepo.Update(existing);
        }
        else
        {
            var item = cmd.UserId.HasValue
                ? CartItem.ForUser(cmd.UserId.Value, cmd.ProductId, cmd.Quantity)
                : CartItem.ForGuest(cmd.SessionId!, cmd.ProductId, cmd.Quantity);
            await cartRepo.AddAsync(item, ct);
        }

        await uow.SaveChangesAsync(ct);
        return await BuildCartDto(cmd.UserId, cmd.SessionId, ct);
    }

    private async Task<CartDto> BuildCartDto(Guid? userId, string? sessionId, CancellationToken ct)
    {
        var items = userId.HasValue
            ? await cartRepo.GetByUserAsync(userId.Value, ct)
            : await cartRepo.GetBySessionAsync(sessionId!, ct);

        var dtos = items.Select(i => new CartItemDto(
            i.Id, i.ProductId, i.Product.Name, i.Product.ImageUrl,
            i.Product.Volume, i.Quantity, i.Product.AvailabilityStatus)).ToList();

        return new CartDto(dtos, dtos.Sum(x => x.Quantity));
    }
}
