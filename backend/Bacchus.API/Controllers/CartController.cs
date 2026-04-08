using Bacchus.Application.Cart.Commands;
using Bacchus.Application.Cart.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bacchus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController(IMediator mediator) : ControllerBase
{
    private Guid? UserId =>
        User.Identity?.IsAuthenticated == true
            ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
            : null;

    private string? SessionId => Request.Headers["X-Session-Id"].FirstOrDefault();

    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken ct)
    {
        var result = await mediator.Send(new GetCartQuery(UserId, SessionId), ct);
        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddItemRequest req, CancellationToken ct)
    {
        var result = await mediator.Send(
            new AddToCartCommand(UserId, SessionId, req.ProductId, req.Quantity), ct);
        return Ok(result);
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> RemoveItem(Guid itemId, CancellationToken ct)
    {
        await mediator.Send(new RemoveCartItemCommand(itemId, UserId, SessionId), ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart(CancellationToken ct)
    {
        await mediator.Send(new ClearCartCommand(UserId, SessionId), ct);
        return NoContent();
    }

    [HttpPost("merge")]
    public async Task<IActionResult> MergeGuestCart([FromBody] MergeRequest req, CancellationToken ct)
    {
        if (!UserId.HasValue) return Unauthorized();
        await mediator.Send(new MergeGuestCartCommand(req.SessionId, UserId.Value), ct);
        return NoContent();
    }
}

public record AddItemRequest(Guid ProductId, int Quantity);
public record MergeRequest(string SessionId);
