using WanJiaDengHuo.Domain.Entities;

namespace WanJiaDengHuo.Domain.Interfaces;

public interface IProductRepository
{
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        string? category, string? style, string? brand,
        string? designer, int? releaseYear, string? keyword,
        int page, int pageSize, CancellationToken ct = default);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Product>> GetRecommendationsAsync(Guid productId, int count = 8, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    void Update(Product product);
    Task<FilterOptionsResult> GetFilterOptionsAsync(CancellationToken ct = default);
}

public record FilterOptionsResult(
    IEnumerable<string> Categories,
    IEnumerable<string> Styles,
    IEnumerable<string> Brands,
    IEnumerable<string> Designers,
    IEnumerable<int> ReleaseYears);
