using WanJiaDengHuo.Domain.Entities;
using WanJiaDengHuo.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace WanJiaDengHuo.Infrastructure.Persistence.Repositories;

public class ProductRepository(BaccDbContext db) : IProductRepository
{
    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        string? category, string? style, string? brand,
        string? designer, int? releaseYear, string? keyword,
        int page, int pageSize, CancellationToken ct = default)
    {
        var query = db.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category == category);
        if (!string.IsNullOrWhiteSpace(style))
            query = query.Where(p => p.Style == style);
        if (!string.IsNullOrWhiteSpace(brand))
            query = query.Where(p => p.Brand == brand);
        if (!string.IsNullOrWhiteSpace(designer))
            query = query.Where(p => p.Designer == designer);
        if (releaseYear.HasValue)
            query = query.Where(p => p.ReleaseYear == releaseYear);
        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(p =>
                p.Name.Contains(keyword) ||
                p.Style.Contains(keyword) ||
                p.Designer.Contains(keyword));

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
            .Where(p => p.Id != productId && (p.Category == product.Category || p.Designer == product.Designer))
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
            products.Select(p => p.Category).Distinct().Order(),
            products.Select(p => p.Style).Distinct().Order(),
            products.Select(p => p.Brand).Distinct().Order(),
            products.Select(p => p.Designer).Distinct().Order(),
            products.Where(p => p.ReleaseYear.HasValue).Select(p => p.ReleaseYear!.Value).Distinct().OrderDescending());
    }
}
