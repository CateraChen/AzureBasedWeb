using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Products.Queries;

public record GetProductsQuery(
    string? WineType,
    string? Varietal,
    string? Region,
    string? Winery,
    int? Vintage,
    string? Keyword,
    int Page = 1,
    int PageSize = 12) : IRequest<PagedResult<ProductSummaryDto>>;

public class GetProductsQueryHandler(IProductRepository repo)
    : IRequestHandler<GetProductsQuery, PagedResult<ProductSummaryDto>>
{
    public async Task<PagedResult<ProductSummaryDto>> Handle(GetProductsQuery q, CancellationToken ct)
    {
        var (items, total) = await repo.GetPagedAsync(
            q.WineType, q.Varietal, q.Region, q.Winery, q.Vintage, q.Keyword,
            q.Page, q.PageSize, ct);

        var dtos = items.Select(p => new ProductSummaryDto(
            p.Id, p.Name, p.WineType, p.Varietal, p.Region, p.Winery, p.Vintage,
            p.Volume, p.ImageUrl, p.AvailabilityStatus, p.StockCases,
            p.RatingScore, p.IsShippingAvailable, p.Deals)).ToList();

        return new PagedResult<ProductSummaryDto>(dtos, total, q.Page, q.PageSize);
    }
}
