using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Products.Queries;

public record GetProductDetailQuery(Guid Id) : IRequest<ProductDetailDto?>;

public class GetProductDetailQueryHandler(IProductRepository repo)
    : IRequestHandler<GetProductDetailQuery, ProductDetailDto?>
{
    public async Task<ProductDetailDto?> Handle(GetProductDetailQuery q, CancellationToken ct)
    {
        var product = await repo.GetByIdAsync(q.Id, ct);
        if (product is null) return null;

        var recommendations = await repo.GetRecommendationsAsync(q.Id, 8, ct);
        var recDtos = recommendations.Select(r => new ProductSummaryDto(
            r.Id, r.Name, r.Category, r.Style, r.Brand, r.Designer, r.ReleaseYear,
            r.SizeRange, r.ImageUrl, r.AvailabilityStatus, r.StockCases,
            r.RatingScore, r.IsShippingAvailable, r.Deals)).ToList();

        return new ProductDetailDto(
            product.Id, product.Name, product.Category, product.Style,
            product.Brand, product.Designer, product.ReleaseYear, product.SizeRange,
            product.ImageUrl, product.AvailabilityStatus, product.StockCases,
            product.RatingScore, product.IsShippingAvailable, product.Deals, recDtos);
    }
}
