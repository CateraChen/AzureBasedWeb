using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Products.Queries;

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
            r.Id, r.Name, r.WineType, r.Varietal, r.Region, r.Winery, r.Vintage,
            r.Volume, r.ImageUrl, r.AvailabilityStatus, r.StockCases,
            r.RatingScore, r.IsShippingAvailable, r.Deals)).ToList();

        return new ProductDetailDto(
            product.Id, product.Name, product.WineType, product.Varietal,
            product.Region, product.Winery, product.Vintage, product.Volume,
            product.ImageUrl, product.AvailabilityStatus, product.StockCases,
            product.RatingScore, product.IsShippingAvailable, product.Deals, recDtos);
    }
}
