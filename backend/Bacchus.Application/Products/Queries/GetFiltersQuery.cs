using Bacchus.Application.Common.DTOs;
using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Products.Queries;

public record GetFiltersQuery : IRequest<FilterOptionsDto>;

public class GetFiltersQueryHandler(IProductRepository repo)
    : IRequestHandler<GetFiltersQuery, FilterOptionsDto>
{
    public async Task<FilterOptionsDto> Handle(GetFiltersQuery _, CancellationToken ct)
    {
        var result = await repo.GetFilterOptionsAsync(ct);
        return new FilterOptionsDto(
            result.WineTypes, result.Varietals, result.Regions,
            result.Wineries, result.Vintages);
    }
}
