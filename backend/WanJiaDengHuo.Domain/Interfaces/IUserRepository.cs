using WanJiaDengHuo.Domain.Entities;

namespace WanJiaDengHuo.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    void Update(User user);
    Task<bool> ExistsAsync(string email, CancellationToken ct = default);
}
