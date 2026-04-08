using Bacchus.Domain.Interfaces;

namespace Bacchus.Infrastructure.Persistence;

public class UnitOfWork(BaccDbContext db) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        db.SaveChangesAsync(ct);
}
