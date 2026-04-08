using Bacchus.Domain.Entities;
using Bacchus.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Bacchus.Infrastructure.Persistence.Repositories;

public class ProductRepository(BaccDbContext db) : IProductRepository
{
    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        string? wineType, string? varietal, string? region,
        string? winery, int? vintage, string? keyword,
        int page, int pageSize, CancellationToken ct = default)
    {
        var query = db.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(wineType))
            query = query.Where(p => p.WineType == wineType);
        if (!string.IsNullOrWhiteSpace(varietal))
            query = query.Where(p => p.Varietal == varietal);
        if (!string.IsNullOrWhiteSpace(region))
            query = query.Where(p => p.Region == region);
        if (!string.IsNullOrWhiteSpace(winery))
            query = query.Where(p => p.Winery == winery);
        if (vintage.HasValue)
            query = query.Where(p => p.Vintage == vintage);
        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(p =>
                p.Name.Contains(keyword) ||
                p.Varietal.Contains(keyword) ||
                p.Winery.Contains(keyword));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<List<Product>> GetRecommendationsAsync(Guid productId, int count = 8, CancellationToken ct = default)
    {
        var product = await db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == productId, ct);
        if (product is null) return [];

        return await db.Products.AsNoTracking()
            .Where(p => p.Id != productId && (p.WineType == product.WineType || p.Winery == product.Winery))
            .OrderBy(_ => Guid.NewGuid())
            .Take(count)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Product product, CancellationToken ct = default) =>
        await db.Products.AddAsync(product, ct);

    public void Update(Product product) => db.Products.Update(product);

    public async Task<FilterOptionsResult> GetFilterOptionsAsync(CancellationToken ct = default)
    {
        var products = await db.Products.AsNoTracking().ToListAsync(ct);
        return new FilterOptionsResult(
            products.Select(p => p.WineType).Distinct().Order(),
            products.Select(p => p.Varietal).Distinct().Order(),
            products.Select(p => p.Region).Distinct().Order(),
            products.Select(p => p.Winery).Distinct().Order(),
            products.Where(p => p.Vintage.HasValue).Select(p => p.Vintage!.Value).Distinct().OrderDescending());
    }
}
