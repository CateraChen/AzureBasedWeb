using WanJiaDengHuo.Application.Wishlist.Commands;
using WanJiaDengHuo.Application.Wishlist.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WanJiaDengHuo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetWishlist(CancellationToken ct)
    {
        var result = await mediator.Send(new GetWishlistQuery(UserId), ct);
        return Ok(result);
    }

    [HttpPost("{productId:guid}")]
    public async Task<IActionResult> Toggle(Guid productId, CancellationToken ct)
    {
        var isAdded = await mediator.Send(new ToggleWishlistCommand(UserId, productId), ct);
        return Ok(new { wishlisted = isAdded });
    }
}
