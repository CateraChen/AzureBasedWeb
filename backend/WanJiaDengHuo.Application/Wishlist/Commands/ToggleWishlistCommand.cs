using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Domain.Entities;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Wishlist.Commands;

public record ToggleWishlistCommand(Guid UserId, Guid ProductId) : IRequest<bool>;

public class ToggleWishlistCommandHandler(
    IWishlistRepository wishlistRepo,
    IUnitOfWork uow)
    : IRequestHandler<ToggleWishlistCommand, bool>
{
    public async Task<bool> Handle(ToggleWishlistCommand cmd, CancellationToken ct)
    {
        var existing = await wishlistRepo.GetAsync(cmd.UserId, cmd.ProductId, ct);
        if (existing is not null)
        {
            wishlistRepo.Remove(existing);
            await uow.SaveChangesAsync(ct);
            return false;
        }
        await wishlistRepo.AddAsync(WishlistItem.Create(cmd.UserId, cmd.ProductId), ct);
        await uow.SaveChangesAsync(ct);
        return true;
    }
}
