using Bacchus.Domain.Entities;

namespace Bacchus.Domain.Interfaces;

public interface IProductRepository
{
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        string? wineType, string? varietal, string? region,
        string? winery, int? vintage, string? keyword,
        int page, int pageSize, CancellationToken ct = default);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Product>> GetRecommendationsAsync(Guid productId, int count = 8, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    void Update(Product product);
    Task<FilterOptionsResult> GetFilterOptionsAsync(CancellationToken ct = default);
}

public record FilterOptionsResult(
    IEnumerable<string> WineTypes,
    IEnumerable<string> Varietals,
    IEnumerable<string> Regions,
    IEnumerable<string> Wineries,
    IEnumerable<int> Vintages);
