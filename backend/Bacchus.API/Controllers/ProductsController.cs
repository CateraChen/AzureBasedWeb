using Bacchus.Application.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Bacchus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? wineType,
        [FromQuery] string? varietal,
        [FromQuery] string? region,
        [FromQuery] string? winery,
        [FromQuery] int? vintage,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(
            new GetProductsQuery(wineType, varietal, region, winery, vintage, keyword, page, pageSize), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        
        var result = await mediator.Send(new GetProductDetailQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters(CancellationToken ct)
    {
        var result = await mediator.Send(new GetFiltersQuery(), ct);
        return Ok(result);
    }
}
