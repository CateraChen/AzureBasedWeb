using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Products.Queries;

public record GetFiltersQuery : IRequest<FilterOptionsDto>;

public class GetFiltersQueryHandler(IProductRepository repo)
    : IRequestHandler<GetFiltersQuery, FilterOptionsDto>
{
    public async Task<FilterOptionsDto> Handle(GetFiltersQuery _, CancellationToken ct)
    {
        var result = await repo.GetFilterOptionsAsync(ct);
        return new FilterOptionsDto(
            result.Categories, result.Styles, result.Brands,
            result.Designers, result.ReleaseYears);
    }
}
