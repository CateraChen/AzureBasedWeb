using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Wishlist.Queries;

public record GetWishlistQuery(Guid UserId) : IRequest<List<WishlistItemDto>>;

public class GetWishlistQueryHandler(IWishlistRepository wishlistRepo)
    : IRequestHandler<GetWishlistQuery, List<WishlistItemDto>>
{
    public async Task<List<WishlistItemDto>> Handle(GetWishlistQuery q, CancellationToken ct)
    {
        var items = await wishlistRepo.GetByUserAsync(q.UserId, ct);
        return items.Select(i => new WishlistItemDto(
            i.Id, i.ProductId, i.Product.Name, i.Product.ImageUrl,
            i.Product.Volume, i.Product.AvailabilityStatus)).ToList();
    }
}
