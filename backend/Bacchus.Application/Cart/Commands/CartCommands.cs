using Bacchus.Domain.Interfaces;
using MediatR;

namespace Bacchus.Application.Cart.Commands;

public record RemoveCartItemCommand(Guid ItemId, Guid? UserId, string? SessionId) : IRequest;

public class RemoveCartItemCommandHandler(ICartRepository cartRepo, IUnitOfWork uow)
    : IRequestHandler<RemoveCartItemCommand>
{
    public async Task Handle(RemoveCartItemCommand cmd, CancellationToken ct)
    {
        var items = cmd.UserId.HasValue
            ? await cartRepo.GetByUserAsync(cmd.UserId.Value, ct)
            : await cartRepo.GetBySessionAsync(cmd.SessionId!, ct);

        var item = items.FirstOrDefault(i => i.Id == cmd.ItemId)
            ?? throw new KeyNotFoundException("Cart item not found.");

        cartRepo.Remove(item);
        await uow.SaveChangesAsync(ct);
    }
}

public record ClearCartCommand(Guid? UserId, string? SessionId) : IRequest;

public class ClearCartCommandHandler(ICartRepository cartRepo, IUnitOfWork uow)
    : IRequestHandler<ClearCartCommand>
{
    public async Task Handle(ClearCartCommand cmd, CancellationToken ct)
    {
        if (cmd.UserId.HasValue)
            await cartRepo.ClearByUserAsync(cmd.UserId.Value, ct);
        else
        {
            var items = await cartRepo.GetBySessionAsync(cmd.SessionId!, ct);
            foreach (var item in items) cartRepo.Remove(item);
        }
        await uow.SaveChangesAsync(ct);
    }
}

public record MergeGuestCartCommand(string SessionId, Guid UserId) : IRequest;

public class MergeGuestCartCommandHandler(ICartRepository cartRepo, IUnitOfWork uow)
    : IRequestHandler<MergeGuestCartCommand>
{
    public async Task Handle(MergeGuestCartCommand cmd, CancellationToken ct)
    {
        await cartRepo.MergeGuestToUserAsync(cmd.SessionId, cmd.UserId, ct);
        await uow.SaveChangesAsync(ct);
    }
}
