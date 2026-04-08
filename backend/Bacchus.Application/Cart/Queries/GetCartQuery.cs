using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Cart.Queries;

public record GetCartQuery(Guid? UserId, string? SessionId) : IRequest<CartDto>;

public class GetCartQueryHandler(ICartRepository cartRepo)
    : IRequestHandler<GetCartQuery, CartDto>
{
    public async Task<CartDto> Handle(GetCartQuery q, CancellationToken ct)
    {
        var items = q.UserId.HasValue
            ? await cartRepo.GetByUserAsync(q.UserId.Value, ct)
            : await cartRepo.GetBySessionAsync(q.SessionId!, ct);

        var dtos = items.Select(i => new CartItemDto(
            i.Id, i.ProductId, i.Product.Name, i.Product.ImageUrl,
            i.Product.Volume, i.Quantity, i.Product.AvailabilityStatus)).ToList();

        return new CartDto(dtos, dtos.Sum(x => x.Quantity));
    }
}
