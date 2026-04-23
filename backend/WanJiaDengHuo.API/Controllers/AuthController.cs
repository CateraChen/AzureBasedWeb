using WanJiaDengHuo.Application.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WanJiaDengHuo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand cmd, CancellationToken ct)
    {
        try
        {
            var result = await mediator.Send(cmd, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand cmd, CancellationToken ct)
    {
        try
        {
            var result = await mediator.Send(cmd, ct);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }
    }
}
