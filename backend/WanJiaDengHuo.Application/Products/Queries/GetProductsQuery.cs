using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Products.Queries;

public record GetProductsQuery(
    string? Category,
    string? Style,
    string? Brand,
    string? Designer,
    int? ReleaseYear,
    string? Keyword,
    int Page = 1,
    int PageSize = 12) : IRequest<PagedResult<ProductSummaryDto>>;

public class GetProductsQueryHandler(IProductRepository repo)
    : IRequestHandler<GetProductsQuery, PagedResult<ProductSummaryDto>>
{
    public async Task<PagedResult<ProductSummaryDto>> Handle(GetProductsQuery q, CancellationToken ct)
    {
        var (items, total) = await repo.GetPagedAsync(
            q.Category, q.Style, q.Brand, q.Designer, q.ReleaseYear, q.Keyword,
            q.Page, q.PageSize, ct);

        var dtos = items.Select(p => new ProductSummaryDto(
            p.Id, p.Name, p.Category, p.Style, p.Brand, p.Designer, p.ReleaseYear,
            p.SizeRange, p.ImageUrl, p.AvailabilityStatus, p.StockCases,
            p.RatingScore, p.IsShippingAvailable, p.Deals)).ToList();

        return new PagedResult<ProductSummaryDto>(dtos, total, q.Page, q.PageSize);
    }
}
